import { Queue, Worker } from 'bullmq';
import { createRedisConnection, isRedisDisabled } from '../config/redis.js';

const connection = isRedisDisabled ? null : createRedisConnection();

// ── Queue Definitions ─────────────────────────────────────────────────
export const emailQueue = isRedisDisabled ? { add: async () => {} } : new Queue('email', { connection });
export const notificationQueue = isRedisDisabled ? { add: async () => {} } : new Queue('notifications', { connection });
export const bracketQueue = isRedisDisabled ? { add: async () => {} } : new Queue('bracket', { connection });

// ── Workers ───────────────────────────────────────────────────────────
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/mailer.js';
import { prisma } from '../config/database.js';

export const emailWorker = isRedisDisabled ? { on: () => {} } : new Worker(
  'email',
  async (job) => {
    switch (job.name) {
      case 'verification':
        await sendVerificationEmail(job.data.email, job.data.token);
        break;
      case 'password-reset':
        await sendPasswordResetEmail(job.data.email, job.data.token);
        break;
    }
  },
  { connection: createRedisConnection() },
);

export const notificationWorker = isRedisDisabled ? { on: () => {} } : new Worker(
  'notifications',
  async (job) => {
    if (job.name === 'create') {
      await prisma.notification.create({ data: job.data });
    }
  },
  { connection: createRedisConnection() },
);

emailWorker.on('failed',        (job, err) => console.error(`[emailWorker] job ${job.id} failed:`, err));
notificationWorker.on('failed', (job, err) => console.error(`[notifWorker] job ${job.id} failed:`, err));

if (!isRedisDisabled) {
  console.log('⚙️  BullMQ workers started');
} else {
  console.log('⚠️  Redis and BullMQ workers are disabled for local development');
}
