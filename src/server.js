import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { prisma } from './config/database.js';
// import { redisClient } from './config/redis.js';
import { registerRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport:
      process.env.NODE_ENV !== 'production'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
  },
  // Expose req.rawBody for Svix webhook signature verification
  addContentTypeParser: false,
});

// ── Raw body — required for Clerk/Svix webhook signature verification ──
app.addContentTypeParser(
  'application/json',
  { parseAs: 'string' },
  (req, body, done) => {
    req.rawBody = body; // store raw string before JSON.parse
    try {
      done(null, JSON.parse(body));
    } catch (err) {
      done(err);
    }
  },
);

// ── Security & Infra Plugins ──────────────────────────────────────────
await app.register(helmet, { contentSecurityPolicy: false });

const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://tournament-frontend-eta.vercel.app',
];

const allowedOrigins = new Set([...defaultAllowedOrigins, ...configuredOrigins]);

await app.register(cors, {
  origin: (origin, cb) => {
    // Allow non-browser requests (no origin header, e.g. server-to-server or curl)
    if (!origin) return cb(null, true);

    const cleanOrigin = origin.replace(/\/$/, '');
    try {
      const hostname = new URL(origin).hostname;
      if (allowedOrigins.has(cleanOrigin) || hostname.endsWith('.vercel.app')) {
        return cb(null, true);
      }
      return cb(null, false);
    } catch {
      return cb(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
});

await app.register(rateLimit, {
  max: 200,
  timeWindow: '1 minute',
  // redis: redisClient,
});

// ── Swagger / OpenAPI ─────────────────────────────────────────────────
if (process.env.SWAGGER_ENABLED === 'true') {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Tournament Platform API',
        description:
          'REST API for the Gaming Tournament Platform. Authentication is handled by Clerk — pass the Clerk session token as a Bearer token.',
        version: '1.0.0',
      },
      servers: [{ url: `http://localhost:${process.env.PORT || 3001}` }],
      components: {
        securitySchemes: {
          // Clerk issues standard JWTs — use Bearer scheme
          clerkAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Clerk session token obtained from the frontend SDK',
          },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list', deepLinking: false },
  });
}

// ── Routes ────────────────────────────────────────────────────────────
await registerRoutes(app);

// ── Error Handler ─────────────────────────────────────────────────────
app.setErrorHandler(errorHandler);

// ── Health Check ──────────────────────────────────────────────────────
app.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
}));

// ── Graceful Shutdown ─────────────────────────────────────────────────
const shutdown = async (signal) => {
  app.log.info(`Received ${signal}. Shutting down…`);
  await app.close();
  await prisma.$disconnect();
  // redisClient.disconnect();
  process.exit(0);
};
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// ── Start ─────────────────────────────────────────────────────────────
const start = async () => {
  try {
    try {
      await prisma.$connect();
      app.log.info('✅ Database connected successfully');
    } catch (dbErr) {
      app.log.error('❌ Database connection failed: ' + dbErr.message);
    }

    const port = parseInt(process.env.PORT || '3001', 10);
    const host = process.env.HOST || '0.0.0.0';
    await app.listen({ port, host });
    app.log.info(`🚀 Server running at http://${host}:${port}`);
    if (process.env.SWAGGER_ENABLED === 'true') {
      app.log.info(`📄 API Docs at http://${host}:${port}/docs`);
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
