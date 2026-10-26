import { TournamentController } from '../controllers/tournament.controller.js';
import { authenticate } from '../middleware/authenticate.js';

export default async function tournamentRoutes(app) {
  const ctrl = new TournamentController();

  // Public
  app.get('/', ctrl.list.bind(ctrl));
  app.get('/:slug', ctrl.getBySlug.bind(ctrl));
  app.get('/:slug/bracket', ctrl.getBracket.bind(ctrl));
  app.get('/:slug/participants', ctrl.getParticipants.bind(ctrl));
  app.get('/:slug/matches', ctrl.getMatches.bind(ctrl));

  // Protected - Create (any authenticated user can host a tournament and becomes its admin)
  app.post('/', { preHandler: [authenticate] }, ctrl.create.bind(ctrl));

  // Protected - Update (Creator, Admin, or Assigned Moderator)
  app.patch('/:id', { preHandler: [authenticate] }, ctrl.update.bind(ctrl));

  // Protected - Delete (STRICT: Creator or Platform Admin only)
  app.delete('/:id', { preHandler: [authenticate] }, ctrl.remove.bind(ctrl));

  // Moderator management (Creator or Platform Admin only)
  app.get('/:id/moderators', { preHandler: [authenticate] }, ctrl.getModerators.bind(ctrl));
  app.post('/:id/moderators', { preHandler: [authenticate] }, ctrl.addModerator.bind(ctrl));
  app.delete('/:id/moderators/:userId', { preHandler: [authenticate] }, ctrl.removeModerator.bind(ctrl));

  // Registration
  app.post('/:id/register', { preHandler: [authenticate] }, ctrl.register.bind(ctrl));
  app.delete('/:id/unregister', { preHandler: [authenticate] }, ctrl.unregister.bind(ctrl));

  // Lifecycle
  app.post('/:id/publish', { preHandler: [authenticate] }, ctrl.publish.bind(ctrl));
  app.post('/:id/start', { preHandler: [authenticate] }, ctrl.start.bind(ctrl));
  app.post('/:id/complete', { preHandler: [authenticate] }, ctrl.complete.bind(ctrl));
}
