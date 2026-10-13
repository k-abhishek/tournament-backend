import { prisma } from '../config/database.js';

export class NotificationController {
  async list(req, reply) {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return reply.send({ notifications });
  }

  async markRead(req, reply) {
    await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: { isRead: true },
    });
    return reply.send({ message: 'Marked as read' });
  }

  async markAllRead(req, reply) {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true },
    });
    return reply.send({ message: 'All notifications marked as read' });
  }

  async remove(req, reply) {
    await prisma.notification.deleteMany({
      where: { id: req.params.id, userId: req.user.id },
    });
    return reply.code(204).send();
  }
}
