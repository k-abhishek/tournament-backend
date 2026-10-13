import { TeamController } from '../controllers/team.controller.js';
import { authenticate } from '../middleware/authenticate.js';

export default async function teamRoutes(app) {
  const ctrl = new TeamController();

  app.post('/', { preHandler: [authenticate] }, ctrl.create.bind(ctrl));
  app.get('/:id', ctrl.getById.bind(ctrl));
  app.patch('/:id', { preHandler: [authenticate] }, ctrl.update.bind(ctrl));
  app.delete('/:id', { preHandler: [authenticate] }, ctrl.remove.bind(ctrl));

  // Member management
  app.post('/:id/invite',  { preHandler: [authenticate] }, ctrl.invite.bind(ctrl));
  app.delete('/:id/leave', { preHandler: [authenticate] }, ctrl.leave.bind(ctrl));
  app.delete('/:id/kick/:userId', { preHandler: [authenticate] }, ctrl.kick.bind(ctrl));
}
