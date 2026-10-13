import { UserController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

export default async function userRoutes(app) {
  const ctrl = new UserController();

  // Public
  app.get('/:username/profile', ctrl.getPublicProfile.bind(ctrl));

  // Protected — own profile
  app.get('/me', { preHandler: [authenticate] }, ctrl.getMe.bind(ctrl));
  app.patch('/me', { preHandler: [authenticate] }, ctrl.updateMe.bind(ctrl));
  app.delete('/me', { preHandler: [authenticate] }, ctrl.deleteMe.bind(ctrl));

  // Admin only
  app.get('/', { preHandler: [authenticate, authorize(['ADMIN'])] }, ctrl.list.bind(ctrl));
  app.patch('/:id/role', { preHandler: [authenticate, authorize(['ADMIN'])] }, ctrl.updateRole.bind(ctrl));
}
