import Redis from 'ioredis';

const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // Required for BullMQ
  enableReadyCheck: false,
  lazyConnect: true,
};

export const isRedisDisabled = process.env.NODE_ENV === 'development';

export const redisClient = isRedisDisabled
  ? { keys: async () => [], on: () => {} }
  : new Redis(redisOptions);

if (!isRedisDisabled) {
  redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});
redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err.message);
  });
}

// Separate connection for BullMQ workers (BullMQ requires dedicated connections)
export const createRedisConnection = () => isRedisDisabled ? null : new Redis(redisOptions);
