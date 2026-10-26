import { prisma } from '../config/database.js';
import { createError } from '../utils/errors.js';
import { generateSlug } from '../utils/slug.js';
import { BracketService } from '../services/bracket.service.js';

export class TournamentController {
  async list(req, reply) {
    const {
      page = 1,
      limit = 12,
      game,
      status,
      format,
      search,
      includeDrafts,
      organizerId,
      moderatorUserId,
    } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      ...(game && { game: { slug: game } }),
      ...(status
        ? { status }
        : includeDrafts === 'true'
        ? {}
        : { status: { not: 'DRAFT' } }),
      ...(format && { format }),
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(organizerId && { organizerId }),
      ...(moderatorUserId && {
        moderators: { some: { userId: moderatorUserId } },
      }),
    };

    const [tournaments, total] = await Promise.all([
      prisma.tournament.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          game: { select: { name: true, slug: true, iconUrl: true } },
          organizer: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          moderators: {
            select: {
              id: true,
              userId: true,
              assignedAt: true,
              user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
            },
          },
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
        organizer: { select: { id: true, username: true, displayName: true, avatarUrl: true, email: true } },
        moderators: {
          select: {
            id: true,
            userId: true,
            assignedAt: true,
            user: { select: { id: true, username: true, displayName: true, avatarUrl: true, email: true } },
          },
        },
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
        participant1: {
          include: {
            user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
            team: { select: { id: true, name: true, logoUrl: true } },
          },
        },
        participant2: {
          include: {
            user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
            team: { select: { id: true, name: true, logoUrl: true } },
          },
        },
        results: true,
      },
      orderBy: [{ round: 'asc' }, { matchNumber: 'asc' }],
    });

    const mappedMatches = matches.map((m) => {
      const res1 = m.results?.find((r) => r.participantId === m.p1Id);
      const res2 = m.results?.find((r) => r.participantId === m.p2Id);
      return {
        ...m,
        score1: res1 ? res1.score : null,
        score2: res2 ? res2.score : null,
      };
    });

    return reply.send({ bracket: mappedMatches });
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
    const {
      name,
      organizerName,
      gameId,
      format,
      maxParticipants,
      isTeamBased,
      teamSize,
      prizePool,
      startDate,
      endDate,
      registrationDeadline,
      description,
      rules,
      bannerUrl,
    } = req.body;

    if (!name || !organizerName || !gameId || !format || !startDate) {
      throw createError(400, 'name, organizerName, gameId, format, and startDate are required');
    }

    if (organizerName && req.user?.id) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { displayName: organizerName },
      }).catch(() => {});
    }

    const slug = await generateSlug(name, (s) =>
      prisma.tournament.findUnique({ where: { slug: s } }),
    );

    const tournament = await prisma.tournament.create({
      data: {
        name,
        slug,
        gameId,
        format,
        maxParticipants: maxParticipants ? Number(maxParticipants) : 16,
        isTeamBased: isTeamBased ?? false,
        teamSize: teamSize ? Number(teamSize) : (isTeamBased ? 5 : 1),
        prizePool: prizePool ? prizePool.toString() : null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
        description,
        rules,
        bannerUrl,
        organizerId: req.user.id, // User who creates is the Tournament Admin
        status: 'DRAFT',
      },
      include: {
        game: true,
        organizer: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        moderators: true,
      },
    });

    return reply.code(201).send({ tournament });
  }

  async update(req, reply) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { moderators: true },
    });
    if (!tournament) throw createError(404, 'Tournament not found');

    const isCreator = tournament.organizerId === req.user.id;
    const isSystemAdmin = req.user.role === 'ADMIN';
    const isModerator = tournament.moderators.some((m) => m.userId === req.user.id);

    if (!isCreator && !isSystemAdmin && !isModerator) {
      throw createError(403, 'Not authorized to update this tournament');
    }

    // Sanitize payload - moderators cannot change organizer or reassign admin rights
    const updateData = { ...req.body };
    delete updateData.organizerId;
    delete updateData.id;
    delete updateData.slug;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
    if (updateData.registrationDeadline) {
      updateData.registrationDeadline = new Date(updateData.registrationDeadline);
    }
    if (updateData.maxParticipants) {
      updateData.maxParticipants = Number(updateData.maxParticipants);
    }
    if (updateData.teamSize) {
      updateData.teamSize = Number(updateData.teamSize);
    }

    const updated = await prisma.tournament.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        game: true,
        organizer: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        moderators: {
          select: {
            id: true,
            userId: true,
            assignedAt: true,
            user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          },
        },
      },
    });

    return reply.send({ tournament: updated });
  }

  async remove(req, reply) {
    const tournament = await prisma.tournament.findUnique({ where: { id: req.params.id } });
    if (!tournament) throw createError(404, 'Tournament not found');

    const isCreator = tournament.organizerId === req.user.id;
    const isSystemAdmin = req.user.role === 'ADMIN';

    // Strict rule: ONLY the Tournament Creator or System Admin can delete
    if (!isCreator && !isSystemAdmin) {
      throw createError(403, 'Only the tournament creator or platform admin can delete this tournament');
    }

    await prisma.tournament.delete({ where: { id: req.params.id } });
    return reply.code(204).send();
  }

  // ── Moderator Management ──────────────────────────────────────────────
  async getModerators(req, reply) {
    const moderators = await prisma.tournamentModerator.findMany({
      where: { tournamentId: req.params.id },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true, email: true } },
      },
      orderBy: { assignedAt: 'asc' },
    });
    return reply.send({ moderators });
  }

  async addModerator(req, reply) {
    const tournament = await prisma.tournament.findUnique({ where: { id: req.params.id } });
    if (!tournament) throw createError(404, 'Tournament not found');

    const isCreator = tournament.organizerId === req.user.id;
    const isSystemAdmin = req.user.role === 'ADMIN';

    if (!isCreator && !isSystemAdmin) {
      throw createError(403, 'Only the tournament creator or platform admin can assign moderators');
    }

    const { userId } = req.body;
    if (!userId) throw createError(400, 'userId is required');

    if (userId === tournament.organizerId) {
      throw createError(400, 'The tournament creator is already the admin');
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) throw createError(404, 'User to assign as moderator not found');

    const existing = await prisma.tournamentModerator.findUnique({
      where: { tournamentId_userId: { tournamentId: tournament.id, userId } },
    });
    if (existing) {
      throw createError(409, 'User is already a moderator for this tournament');
    }

    const moderator = await prisma.tournamentModerator.create({
      data: { tournamentId: tournament.id, userId },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true, email: true } },
      },
    });

    return reply.code(201).send({ moderator });
  }

  async removeModerator(req, reply) {
    const tournament = await prisma.tournament.findUnique({ where: { id: req.params.id } });
    if (!tournament) throw createError(404, 'Tournament not found');

    const isCreator = tournament.organizerId === req.user.id;
    const isSystemAdmin = req.user.role === 'ADMIN';

    if (!isCreator && !isSystemAdmin) {
      throw createError(403, 'Only the tournament creator or platform admin can remove moderators');
    }

    await prisma.tournamentModerator.deleteMany({
      where: { tournamentId: tournament.id, userId: req.params.userId },
    });

    return reply.code(204).send();
  }

  // ── Registration ──────────────────────────────────────────────────────
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

  // ── Lifecycle ─────────────────────────────────────────────────────────
  async publish(req, reply) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { moderators: true },
    });
    if (!tournament) throw createError(404, 'Tournament not found');

    const isAuthorized =
      tournament.organizerId === req.user.id ||
      req.user.role === 'ADMIN' ||
      tournament.moderators.some((m) => m.userId === req.user.id);

    if (!isAuthorized) throw createError(403, 'Not authorized');
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
      include: { participants: true, moderators: true },
    });
    if (!tournament) throw createError(404, 'Tournament not found');

    const isAuthorized =
      tournament.organizerId === req.user.id ||
      req.user.role === 'ADMIN' ||
      tournament.moderators.some((m) => m.userId === req.user.id);

    if (!isAuthorized) throw createError(403, 'Not authorized');

    const bracketService = new BracketService();
    await bracketService.generate(tournament);

    const updated = await prisma.tournament.update({
      where: { id: req.params.id },
      data: { status: 'ONGOING' },
    });
    return reply.send({ tournament: updated });
  }

  async complete(req, reply) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { moderators: true },
    });
    if (!tournament) throw createError(404, 'Tournament not found');

    const isAuthorized =
      tournament.organizerId === req.user.id ||
      req.user.role === 'ADMIN' ||
      tournament.moderators.some((m) => m.userId === req.user.id);

    if (!isAuthorized) throw createError(403, 'Not authorized');

    const updated = await prisma.tournament.update({
      where: { id: req.params.id },
      data: { status: 'COMPLETED', endDate: new Date() },
    });
    return reply.send({ tournament: updated });
  }
}
