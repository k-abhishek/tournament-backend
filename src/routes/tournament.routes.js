import { TournamentController } from '../controllers/tournament.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

export default async function tournamentRoutes(app) {
  const ctrl = new TournamentController();

  // Public
  app.get('/',      ctrl.list.bind(ctrl));
  app.get('/:slug', ctrl.getBySlug.bind(ctrl));
  app.get('/:slug/bracket', ctrl.getBracket.bind(ctrl));
  app.get('/:slug/participants', ctrl.getParticipants.bind(ctrl));
  app.get('/:slug/matches', ctrl.getMatches.bind(ctrl));

  // Protected — organizer or admin
  app.post(
    '/',
    { preHandler: [authenticate, authorize(['ORGANIZER', 'ADMIN'])] },
    ctrl.create.bind(ctrl),
  );
  app.patch(
    '/:id',
    { preHandler: [authenticate, authorize(['ORGANIZER', 'ADMIN'])] },
    ctrl.update.bind(ctrl),
  );
  app.delete(
    '/:id',
    { preHandler: [authenticate, authorize(['ORGANIZER', 'ADMIN'])] },
    ctrl.remove.bind(ctrl),
  );

  // Registration
  app.post(
    '/:id/register',
    { preHandler: [authenticate] },
    ctrl.register.bind(ctrl),
  );
  app.delete(
    '/:id/unregister',
    { preHandler: [authenticate] },
    ctrl.unregister.bind(ctrl),
  );

  // Lifecycle
  app.post(
    '/:id/publish',
    { preHandler: [authenticate, authorize(['ORGANIZER', 'ADMIN'])] },
    ctrl.publish.bind(ctrl),
  );
  app.post(
    '/:id/start',
    { preHandler: [authenticate, authorize(['ORGANIZER', 'ADMIN'])] },
    ctrl.start.bind(ctrl),
  );
  app.post(
    '/:id/complete',
    { preHandler: [authenticate, authorize(['ORGANIZER', 'ADMIN'])] },
    ctrl.complete.bind(ctrl),
  );
}
