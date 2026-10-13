import { GameController } from '../controllers/game.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

export default async function gameRoutes(app) {
  const ctrl = new GameController();

  app.get('/', ctrl.list.bind(ctrl));
  app.get('/:slug', ctrl.getBySlug.bind(ctrl));
  app.post('/', { preHandler: [authenticate, authorize(['ADMIN'])] }, ctrl.create.bind(ctrl));
  app.patch('/:id', { preHandler: [authenticate, authorize(['ADMIN'])] }, ctrl.update.bind(ctrl));
  app.delete('/:id', { preHandler: [authenticate, authorize(['ADMIN'])] }, ctrl.remove.bind(ctrl));
}
