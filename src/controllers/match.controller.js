import { prisma } from '../config/database.js';
import { createError } from '../utils/errors.js';

export class MatchController {
  async getById(req, reply) {
    const match = await prisma.match.findUnique({
      where: { id: req.params.id },
      include: {
        participant1: { include: { user: { select: { username: true, avatarUrl: true } }, team: { select: { name: true } } } },
        participant2: { include: { user: { select: { username: true, avatarUrl: true } }, team: { select: { name: true } } } },
        results: { include: { reportedBy: { select: { username: true } } } },
      },
    });
    if (!match) throw createError(404, 'Match not found');
    return reply.send({ match });
  }

  async reportResult(req, reply) {
    const { participantId, score } = req.body;
    const match = await prisma.match.findUnique({ where: { id: req.params.id } });
    if (!match) throw createError(404, 'Match not found');
    if (match.status === 'COMPLETED') throw createError(400, 'Match already completed');

    await prisma.matchResult.create({
      data: { matchId: match.id, participantId, score, reportedById: req.user.id },
    });

    return reply.code(201).send({ message: 'Result reported successfully' });
  }

  async update(req, reply) {
    const { winnerId, status, scheduledAt, notes } = req.body;
    const match = await prisma.match.update({
      where: { id: req.params.id },
      data: {
        winnerId, status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
        notes,
      },
    });
    return reply.send({ match });
  }
}
