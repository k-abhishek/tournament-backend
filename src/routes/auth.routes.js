import { ClerkWebhookController } from '../controllers/clerkWebhook.controller.js';

/**
 * Clerk webhook routes.
 * These endpoints are called by Clerk (not by browser clients).
 * They sync user & org membership changes into our database.
 *
 * Register in Clerk Dashboard → Webhooks → Add Endpoint:
 *   URL: https://your-domain.com/api/webhooks/clerk
 *   Events: user.created, user.updated, user.deleted,
 *            organizationMembership.created, organizationMembership.deleted
 */
export default async function clerkWebhookRoutes(app) {
  const ctrl = new ClerkWebhookController();

  // Raw body is required for Svix signature verification
  app.post(
    '/clerk',
    {
      config: { rawBody: true }, // instructs Fastify to expose req.rawBody
    },
    ctrl.handle.bind(ctrl),
  );
}
