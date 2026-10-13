import { prisma } from '../config/database.js';
import { createError } from '../utils/errors.js';
import { generateSlug } from '../utils/slug.js';
import { BracketService } from '../services/bracket.service.js';

export class TournamentController {
  async list(req, reply) {
    const { page = 1, limit = 12, game, status, format, search, includeDrafts } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      ...(game   && { game: { slug: game } }),
      ...(status ? { status } : (includeDrafts === 'true' ? {} : { status: { not: 'DRAFT' } })),
      ...(format && { format }),
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    };

    const [tournaments, total] = await Promise.all([
      prisma.tournament.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          game: { select: { name: true, slug: true, iconUrl: true } },
          organizer: { select: { username: true, displayName: true, avatarUrl: true } },
          _count: { select: { participants: true } },
        },
      }),
      prisma.tournament.count({ where }),
    ]);

    return reply.send({ tournaments, total, page: Number(page), limit: Number(limit) });
  }

  async getBySlug(req, reply) {
    const tournament = await prisma.tournament.findUnique({
      where: { slug: req.params.slug },
      include: {
        game: true,
        organizer: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        _count: { select: { participants: true, matches: true } },
      },
    });
    if (!tournament) throw createError(404, 'Tournament not found');
    return reply.send({ tournament });
  }

  async getBracket(req, reply) {
    const tournament = await prisma.tournament.findUnique({ where: { slug: req.params.slug } });
    if (!tournament) throw createError(404, 'Tournament not found');

    const matches = await prisma.match.findMany({
      where: { tournamentId: tournament.id },
      include: {
        participant1: { include: { user: { select: { username: true, avatarUrl: true } }, team: { select: { name: true, logoUrl: true } } } },
        participant2: { include: { user: { select: { username: true, avatarUrl: true } }, team: { select: { name: true, logoUrl: true } } } },
      },
      orderBy: [{ round: 'asc' }, { matchNumber: 'asc' }],
    });

    return reply.send({ bracket: matches });
  }

  async getParticipants(req, reply) {
    const tournament = await prisma.tournament.findUnique({ where: { slug: req.params.slug } });
    if (!tournament) throw createError(404, 'Tournament not found');

    const participants = await prisma.participant.findMany({
      where: { tournamentId: tournament.id },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        team: { select: { id: true, name: true, logoUrl: true } },
      },
    });
    return reply.send({ participants });
  }

  async getMatches(req, reply) {
    const tournament = await prisma.tournament.findUnique({ where: { slug: req.params.slug } });
    if (!tournament) throw createError(404, 'Tournament not found');

    const matches = await prisma.match.findMany({
      where: { tournamentId: tournament.id },
      orderBy: [{ round: 'asc' }, { matchNumber: 'asc' }],
    });
    return reply.send({ matches });
  }

  async create(req, reply) {
    const { name, gameId, format, maxParticipants, isTeamBased, teamSize,
            prizePool, startDate, endDate, registrationDeadline, description, rules } = req.body;

    const slug = await generateSlug(name, (s) =>
      prisma.tournament.findUnique({ where: { slug: s } }),
    );

    const tournament = await prisma.tournament.create({
      data: {
        name, slug, gameId, format, maxParticipants,
        isTeamBased: isTeamBased ?? false,
        teamSize, prizePool, startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
        description, rules,
        organizerId: req.user.id,
        clerkOrgId: req.body.clerkOrgId || req.headers['organization-id'] || null,
      },
    });

    return reply.code(201).send({ tournament });
  }

  async update(req, reply) {
    const tournament = await prisma.tournament.findUnique({ where: { id: req.params.id } });
    if (!tournament) throw createError(404, 'Tournament not found');
    if (tournament.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw createError(403, 'Not authorized');
    }

    const updated = await prisma.tournament.update({
      where: { id: req.params.id },
      data: req.body,
    });
    return reply.send({ tournament: updated });
  }

  async remove(req, reply) {
    const tournament = await prisma.tournament.findUnique({ where: { id: req.params.id } });
    if (!tournament) throw createError(404, 'Tournament not found');
    if (tournament.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw createError(403, 'Not authorized');
    }

    await prisma.tournament.delete({ where: { id: req.params.id } });
    return reply.code(204).send();
  }

  async register(req, reply) {
    const tournament = await prisma.tournament.findUnique({ where: { id: req.params.id } });
    if (!tournament) throw createError(404, 'Tournament not found');
    if (tournament.status !== 'REGISTRATION_OPEN') throw createError(400, 'Registration is not open');

    const count = await prisma.participant.count({ where: { tournamentId: tournament.id } });
    if (count >= tournament.maxParticipants) throw createError(409, 'Tournament is full');

    const already = await prisma.participant.findUnique({
      where: { tournamentId_userId: { tournamentId: tournament.id, userId: req.user.id } },
    });
    if (already) throw createError(409, 'Already registered');

    const participant = await prisma.participant.create({
      data: { tournamentId: tournament.id, userId: req.user.id },
    });
    return reply.code(201).send({ participant });
  }

  async unregister(req, reply) {
    await prisma.participant.deleteMany({
      where: { tournamentId: req.params.id, userId: req.user.id },
    });
    return reply.code(204).send();
  }

  async publish(req, reply) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
    });
    if (!tournament) throw createError(404, 'Tournament not found');
    if (tournament.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw createError(403, 'Not authorized');
    }
    if (tournament.status !== 'DRAFT') {
      throw createError(400, 'Only draft tournaments can be published');
    }

    const updated = await prisma.tournament.update({
      where: { id: req.params.id },
      data: { status: 'REGISTRATION_OPEN' },
    });
    return reply.send({ tournament: updated });
  }

  async start(req, reply) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { participants: true },
    });
    if (!tournament) throw createError(404, 'Tournament not found');
    if (tournament.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw createError(403, 'Not authorized');
    }

    const bracketService = new BracketService();
    await bracketService.generate(tournament);

    const updated = await prisma.tournament.update({
      where: { id: req.params.id },
      data: { status: 'ONGOING' },
    });
    return reply.send({ tournament: updated });
  }

  async complete(req, reply) {
    const updated = await prisma.tournament.update({
      where: { id: req.params.id },
      data: { status: 'COMPLETED', endDate: new Date() },
    });
    return reply.send({ tournament: updated });
  }
}
