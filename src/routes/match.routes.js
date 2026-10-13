import { MatchController } from '../controllers/match.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

export default async function matchRoutes(app) {
  const ctrl = new MatchController();

  // Public
  app.get('/:id', ctrl.getById.bind(ctrl));

  // Report match result — participants or organizers
  app.post(
    '/:id/result',
    { preHandler: [authenticate] },
    ctrl.reportResult.bind(ctrl),
  );

  // Organizer/Admin override
  app.patch(
    '/:id',
    { preHandler: [authenticate, authorize(['ORGANIZER', 'ADMIN'])] },
    ctrl.update.bind(ctrl),
  );
}
