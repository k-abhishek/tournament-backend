import { prisma } from '../config/database.js';
import { createError } from '../utils/errors.js';

export class UserController {
  async getPublicProfile(req, reply) {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      select: {
        id: true, username: true, displayName: true, avatarUrl: true, bio: true,
        role: true, createdAt: true,
        organizedTournaments: {
          select: { id: true, name: true, slug: true, status: true, teamSize: true },
          take: 5, orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!user) throw createError(404, 'User not found');
    return reply.send({ user });
  }

  async getMe(req, reply) {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, email: true, username: true, displayName: true,
        avatarUrl: true, bio: true, role: true, createdAt: true,
      },
    });
    return reply.send({ user });
  }

  async updateMe(req, reply) {
    const { displayName, bio, avatarUrl } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { displayName, bio, avatarUrl },
      select: { id: true, username: true, displayName: true, avatarUrl: true, bio: true },
    });
    return reply.send({ user });
  }

  async deleteMe(req, reply) {
    await prisma.user.delete({ where: { id: req.user.id } });
    return reply.code(204).send();
  }

  async list(req, reply) {
    const { page = 1, limit = 50, search = '' } = req.query;
    const where = search
      ? {
          OR: [
            { username: { contains: search, mode: 'insensitive' } },
            { displayName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
        },
        orderBy: { username: 'asc' },
      }),
      prisma.user.count({ where }),
    ]);
    return reply.send({ users, total });
  }

  async updateRole(req, reply) {
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, username: true, role: true },
    });
    return reply.send({ user });
  }

  // My team memberships (all tournaments)
  async getMyTeams(req, reply) {
    const memberships = await prisma.teamMember.findMany({
      where: { userId: req.user.id },
      include: {
        team: {
          include: {
            tournament: { select: { id: true, name: true, slug: true, status: true, teamSize: true } },
            members: {
              include: {
                user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
              },
              orderBy: { joinedAt: 'asc' },
            },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });
    return reply.send({ memberships });
  }

  // Pending team invitations for current user
  async getMyInvites(req, reply) {
    const invites = await prisma.teamMember.findMany({
      where: {
        userId: req.user.id,
        status: 'PENDING',
        role: 'MEMBER',
      },
      include: {
        team: {
          include: {
            tournament: { select: { id: true, name: true, slug: true, status: true, teamSize: true } },
            members: {
              where: { role: 'CAPTAIN' },
              include: {
                user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
              },
            },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });
    return reply.send({ invites });
  }

}
