import Redis from 'ioredis';

// Redis is disabled across all environments (dev and prod) unless explicitly enabled via ENABLE_REDIS=true
export const isRedisDisabled = process.env.ENABLE_REDIS !== 'true';

const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
};

export const redisClient = isRedisDisabled
  ? {
      get: async () => null,
      set: async () => 'OK',
      del: async () => 0,
      keys: async () => [],
      on: () => {},
      disconnect: () => {},
      quit: async () => {},
    }
  : new Redis(redisOptions);

if (!isRedisDisabled) {
  redisClient.on('connect', () => {
    console.log('✅ Redis connected');
  });
  redisClient.on('error', (err) => {
    console.error('❌ Redis error:', err.message);
  });
}

// Dedicated connection for BullMQ workers if Redis is enabled
export const createRedisConnection = () => (isRedisDisabled ? null : new Redis(redisOptions));

