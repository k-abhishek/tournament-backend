import { NotificationController } from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/authenticate.js';

export default async function notificationRoutes(app) {
  const ctrl = new NotificationController();

  app.get('/', { preHandler: [authenticate] }, ctrl.list.bind(ctrl));
  app.patch('/:id/read', { preHandler: [authenticate] }, ctrl.markRead.bind(ctrl));
  app.patch('/read-all', { preHandler: [authenticate] }, ctrl.markAllRead.bind(ctrl));
  app.delete('/:id', { preHandler: [authenticate] }, ctrl.remove.bind(ctrl));
}
