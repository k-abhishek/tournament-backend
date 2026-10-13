import { prisma } from '../config/database.js';
import { createError } from '../utils/errors.js';

export class TeamController {
  async create(req, reply) {
    const { name, tournamentId, logoUrl } = req.body;

    const team = await prisma.team.create({
      data: {
        name,
        tournamentId,
        logoUrl,
        members: { create: { userId: req.user.id, role: 'CAPTAIN' } },
      },
      include: { members: { include: { user: { select: { username: true, avatarUrl: true } } } } },
    });
    return reply.code(201).send({ team });
  }

  async getById(req, reply) {
    const team = await prisma.team.findUnique({
      where: { id: req.params.id },
      include: {
        members: { include: { user: { select: { id: true, username: true, avatarUrl: true } } } },
        tournament: { select: { id: true, name: true, slug: true } },
      },
    });
    if (!team) throw createError(404, 'Team not found');
    return reply.send({ team });
  }

  async update(req, reply) {
    const member = await prisma.teamMember.findFirst({
      where: { teamId: req.params.id, userId: req.user.id, role: 'CAPTAIN' },
    });
    if (!member && req.user.role !== 'ADMIN') throw createError(403, 'Only the captain can update team info');

    const team = await prisma.team.update({
      where: { id: req.params.id },
      data: req.body,
    });
    return reply.send({ team });
  }

  async remove(req, reply) {
    const member = await prisma.teamMember.findFirst({
      where: { teamId: req.params.id, userId: req.user.id, role: 'CAPTAIN' },
    });
    if (!member && req.user.role !== 'ADMIN') throw createError(403, 'Only the captain can delete the team');

    await prisma.team.delete({ where: { id: req.params.id } });
    return reply.code(204).send();
  }

  async invite(req, reply) {
    const { userId } = req.body;
    const isCaptain = await prisma.teamMember.findFirst({
      where: { teamId: req.params.id, userId: req.user.id, role: 'CAPTAIN' },
    });
    if (!isCaptain) throw createError(403, 'Only the captain can invite members');

    const already = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId: req.params.id, userId } },
    });
    if (already) throw createError(409, 'User already in team');

    await prisma.teamMember.create({ data: { teamId: req.params.id, userId } });
    return reply.code(201).send({ message: 'Member added successfully' });
  }

  async leave(req, reply) {
    await prisma.teamMember.deleteMany({
      where: { teamId: req.params.id, userId: req.user.id },
    });
    return reply.code(204).send();
  }

  async kick(req, reply) {
    const isCaptain = await prisma.teamMember.findFirst({
      where: { teamId: req.params.id, userId: req.user.id, role: 'CAPTAIN' },
    });
    if (!isCaptain) throw createError(403, 'Only the captain can kick members');

    await prisma.teamMember.deleteMany({
      where: { teamId: req.params.id, userId: req.params.userId },
    });
    return reply.code(204).send();
  }
}
