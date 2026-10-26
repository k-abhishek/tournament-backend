import { verifyToken, createClerkClient } from '@clerk/backend';
import { createError } from '../utils/errors.js';
import { prisma } from '../config/database.js';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

/**
 * Fastify preHandler - verifies a Clerk session JWT from the Authorization header
 * and attaches the local DB user to req.user.
 *
 * Flow:
 *   1. Extract Bearer token from Authorization header
 *   2. Verify the token with Clerk (checks signature + expiry)
 *   3. Look up the corresponding User row in our DB (synced via webhook)
 *   4. Attach user to req.user so downstream handlers can use it
 */
export async function authenticate(req, reply) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError(401, 'Authorization token required');
  }

  const token = authHeader.slice(7);

  let clerkPayload;
  try {
    // Verify with Clerk - this validates signature, expiry, and issuer
    clerkPayload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
  } catch (err) {
    throw createError(401, `Invalid or expired session token: ${err.message}`);
  }

  const clerkId = clerkPayload.sub; // Clerk user ID (user_xxxxx)

  // Fetch the local user record (created/updated by Clerk webhook)
  let user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    // In local development or if webhook hasn't fired yet, retrieve user directly from Clerk
    try {
      const clerkUser = await clerk.users.getUser(clerkId);
      if (clerkUser) {
        const primaryEmail =
          clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
          clerkUser.emailAddresses?.[0]?.emailAddress ||
          `${clerkId}@example.com`;
        const baseUsername = clerkUser.username || clerkUser.firstName?.toLowerCase() || clerkId;
        user = await prisma.user.upsert({
          where: { clerkId },
          create: {
            clerkId,
            email: primaryEmail,
            username: baseUsername,
            displayName:
              [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || baseUsername,
            avatarUrl: clerkUser.imageUrl,
          },
          update: {
            avatarUrl: clerkUser.imageUrl,
          },
        });
      }
    } catch {
      // Ignore and proceed to not found check
    }
  }

  if (!user) {
    throw createError(
      404,
      'User account not found in database. Please wait a moment and try again.',
    );
  }

  // Attach to request for downstream use
  req.user = user;
  // Also expose raw Clerk payload in case handlers need org membership etc.
  req.clerkPayload = clerkPayload;
}