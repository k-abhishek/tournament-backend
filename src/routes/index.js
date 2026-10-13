import clerkWebhookRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import tournamentRoutes from './tournament.routes.js';
import matchRoutes from './match.routes.js';
import teamRoutes from './team.routes.js';
import gameRoutes from './game.routes.js';
import notificationRoutes from './notification.routes.js';

/**
 * Register all application routes with their prefixes.
 * @param {import('fastify').FastifyInstance} app
 */
export async function registerRoutes(app) {
  // Clerk webhooks (no auth — verified via Svix signature)
  app.register(clerkWebhookRoutes, { prefix: '/api/webhooks' });

  // Resource API routes (protected by Clerk JWT)
  app.register(userRoutes,         { prefix: '/api/users' });
  app.register(tournamentRoutes,   { prefix: '/api/tournaments' });
  app.register(matchRoutes,        { prefix: '/api/matches' });
  app.register(teamRoutes,         { prefix: '/api/teams' });
  app.register(gameRoutes,         { prefix: '/api/games' });
  app.register(notificationRoutes, { prefix: '/api/notifications' });
}
