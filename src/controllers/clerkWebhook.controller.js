import { Webhook } from 'svix';
import { prisma } from '../config/database.js';

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

/**
 * Handles incoming Clerk webhook events and keeps our User table in sync.
 *
 * Supported events:
 *   user.created                      → create User row
 *   user.updated                      → update User row
 *   user.deleted                      → delete User row
 *   organizationMembership.created    → add clerkOrgId to User.clerkOrgIds
 *   organizationMembership.deleted    → remove clerkOrgId from User.clerkOrgIds
 */
export class ClerkWebhookController {
  async handle(req, reply) {
    if (!WEBHOOK_SECRET) {
      req.log.error('CLERK_WEBHOOK_SECRET is not set');
      return reply.code(500).send({ error: 'Webhook secret not configured' });
    }

    // ── 1. Verify Svix signature ──────────────────────────────────────
    const svixId        = req.headers['svix-id'];
    const svixTimestamp = req.headers['svix-timestamp'];
    const svixSignature = req.headers['svix-signature'];

    if (!svixId || !svixTimestamp || !svixSignature) {
      return reply.code(400).send({ error: 'Missing Svix headers' });
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    let event;

    try {
      // req.rawBody is the raw Buffer/string — needed for Svix HMAC verification
      const body = typeof req.rawBody === 'string'
        ? req.rawBody
        : JSON.stringify(req.body);

      event = wh.verify(body, {
        'svix-id':        svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
    } catch (err) {
      req.log.warn('Clerk webhook signature verification failed:', err.message);
      return reply.code(400).send({ error: 'Invalid webhook signature' });
    }

    // ── 2. Route to handler ───────────────────────────────────────────
    const { type, data } = event;
    req.log.info(`Clerk webhook: ${type}`);

    try {
      switch (type) {
        case 'user.created':   await this.#onUserCreated(data);   break;
        case 'user.updated':   await this.#onUserUpdated(data);   break;
        case 'user.deleted':   await this.#onUserDeleted(data);   break;
        case 'organizationMembership.created':
          await this.#onOrgMembershipCreated(data); break;
        case 'organizationMembership.deleted':
          await this.#onOrgMembershipDeleted(data); break;
        default:
          req.log.info(`Unhandled Clerk event type: ${type}`);
      }
    } catch (err) {
      req.log.error(`Error handling Clerk event ${type}:`, err);
      return reply.code(500).send({ error: 'Internal error processing webhook' });
    }

    return reply.code(200).send({ received: true });
  }

  // ── Event Handlers ────────────────────────────────────────────────────

  /**
   * user.created — provision a new User row in our DB.
   * Clerk is the source of truth; we just mirror the essentials.
   */
  async #onUserCreated(data) {
    const primaryEmail = data.email_addresses?.find(
      (e) => e.id === data.primary_email_address_id,
    )?.email_address;

    if (!primaryEmail) {
      console.warn(`user.created: no primary email for Clerk user ${data.id}`);
      return;
    }

    // Derive a unique username: prefer Clerk username, fall back to email prefix
    let username = data.username ?? primaryEmail.split('@')[0];
    username = username.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30);

    // Ensure uniqueness with a numeric suffix if needed
    let final = username;
    let i = 1;
    while (await prisma.user.findUnique({ where: { username: final } })) {
      final = `${username}${i++}`;
    }

    await prisma.user.create({
      data: {
        clerkId:     data.id,
        email:       primaryEmail,
        username:    final,
        displayName: [data.first_name, data.last_name].filter(Boolean).join(' ') || null,
        avatarUrl:   data.image_url ?? null,
      },
    });
  }

  /**
   * user.updated — sync profile changes (name, avatar, email).
   */
  async #onUserUpdated(data) {
    const primaryEmail = data.email_addresses?.find(
      (e) => e.id === data.primary_email_address_id,
    )?.email_address;

    await prisma.user.updateMany({
      where: { clerkId: data.id },
      data: {
        ...(primaryEmail && { email: primaryEmail }),
        displayName: [data.first_name, data.last_name].filter(Boolean).join(' ') || null,
        avatarUrl:   data.image_url ?? null,
      },
    });
  }

  /**
   * user.deleted — remove the user record.
   * Cascade deletes will handle related notifications / team memberships.
   */
  async #onUserDeleted(data) {
    await prisma.user.deleteMany({ where: { clerkId: data.id } });
  }

  /**
   * organizationMembership.created — add the org to the user's clerkOrgIds array.
   * Used so the backend can quickly check "is this user an organizer for this org?"
   */
  async #onOrgMembershipCreated(data) {
    const clerkUserId = data.public_user_data?.user_id;
    const clerkOrgId  = data.organization?.id;
    if (!clerkUserId || !clerkOrgId) return;

    const user = await prisma.user.findUnique({ where: { clerkId: clerkUserId } });
    if (!user) return;

    const updated = [...new Set([...user.clerkOrgIds, clerkOrgId])];

    // Promote to ORGANIZER role if not already ADMIN
    const newRole = user.role === 'ADMIN' ? 'ADMIN' : 'ORGANIZER';

    await prisma.user.update({
      where: { clerkId: clerkUserId },
      data: { clerkOrgIds: updated, role: newRole },
    });
  }

  /**
   * organizationMembership.deleted — remove the org from clerkOrgIds.
   * Reverts role to PLAYER if no orgs remain.
   */
  async #onOrgMembershipDeleted(data) {
    const clerkUserId = data.public_user_data?.user_id;
    const clerkOrgId  = data.organization?.id;
    if (!clerkUserId || !clerkOrgId) return;

    const user = await prisma.user.findUnique({ where: { clerkId: clerkUserId } });
    if (!user) return;

    const updated = user.clerkOrgIds.filter((id) => id !== clerkOrgId);
    const newRole  = user.role === 'ADMIN'
      ? 'ADMIN'
      : updated.length > 0 ? 'ORGANIZER' : 'PLAYER';

    await prisma.user.update({
      where: { clerkId: clerkUserId },
      data: { clerkOrgIds: updated, role: newRole },
    });
  }
}
