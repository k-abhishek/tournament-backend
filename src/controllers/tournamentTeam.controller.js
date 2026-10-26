import { prisma } from '../config/database.js';
import { createError } from '../utils/errors.js';

/**
 * TournamentTeamController
 * Handles team registration within a specific tournament context.
 * Routes are mounted under: /api/tournaments/:id/teams
 */
export class TournamentTeamController {
  // ── GET /api/tournaments/:id/teams ──────────────────────────────────────
  async list(req, reply) {
    const { id } = req.params;
    const tournament = await prisma.tournament.findUnique({ where: { id } });
    if (!tournament) throw createError(404, 'Tournament not found');

    const teams = await prisma.team.findMany({
      where: { tournamentId: id },
      include: {
        _count: { select: { members: true } },
        members: {
          include: {
            user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          },
          orderBy: { joinedAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return reply.send({ teams });
  }

  // ── POST /api/tournaments/:id/teams ─────────────────────────────────────
  // Registers a new team for the tournament. Caller becomes the CAPTAIN.
  async create(req, reply) {
    const { id } = req.params;
    const { name, logoUrl } = req.body;

    if (!name?.trim()) throw createError(400, 'Team name is required');

    const tournament = await prisma.tournament.findUnique({ where: { id } });
    if (!tournament) throw createError(404, 'Tournament not found');
    if (tournament.status !== 'REGISTRATION_OPEN') {
      throw createError(400, 'Registration is not open for this tournament');
    }

    // Check if the user is already a captain/member in any team in this tournament
    const existing = await prisma.teamMember.findFirst({
      where: {
        userId: req.user.id,
        team: { tournamentId: id },
      },
    });
    if (existing) throw createError(409, 'You are already registered in a team for this tournament');

    // Check team slot availability
    const teamCount = await prisma.team.count({ where: { tournamentId: id } });
    if (teamCount >= tournament.maxParticipants) {
      throw createError(409, 'This tournament has reached its maximum team capacity');
    }

    // Create team + captain member in one transaction
    const team = await prisma.team.create({
      data: {
        name: name.trim(),
        tournamentId: id,
        logoUrl,
        members: {
          create: {
            userId: req.user.id,
            role: 'CAPTAIN',
            status: 'ACCEPTED',
          },
        },
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          },
        },
      },
    });

    return reply.code(201).send({ team, teamId: team.id });
  }

  // ── POST /api/tournaments/:id/teams/:teamId/members ──────────────────────
  // Captain invites a user to the team. Member starts with PENDING status.
  async inviteMember(req, reply) {
    const { id: tournamentId, teamId } = req.params;
    const { userId } = req.body;
    if (!userId) throw createError(400, 'userId is required');

    const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tournament) throw createError(404, 'Tournament not found');

    const team = await prisma.team.findFirst({ where: { id: teamId, tournamentId } });
    if (!team) throw createError(404, 'Team not found in this tournament');

    // Only captain may invite
    const captainRecord = await prisma.teamMember.findFirst({
      where: { teamId, userId: req.user.id, role: 'CAPTAIN' },
    });
    if (!captainRecord) throw createError(403, 'Only the team captain can invite members');

    // Validate invite target exists
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) throw createError(404, 'User not found');

    // Check member slot: total members (accepted + pending) < teamSize + 1
    const maxSlots = (tournament.teamSize ?? 5) + 1;
    const currentCount = await prisma.teamMember.count({ where: { teamId } });
    if (currentCount >= maxSlots) {
      throw createError(409, `Team is full. Maximum ${maxSlots} members allowed (${tournament.teamSize ?? 5} + 1 substitute)`);
    }

    // Check already in another team in this tournament
    const alreadyInTournament = await prisma.teamMember.findFirst({
      where: { userId, team: { tournamentId } },
    });
    if (alreadyInTournament) {
      throw createError(409, 'This user is already registered in a team for this tournament');
    }

    // Check already in this team
    const alreadyInTeam = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
    if (alreadyInTeam) throw createError(409, 'User is already in this team');

    // Create pending member record
    const member = await prisma.teamMember.create({
      data: { teamId, userId, role: 'MEMBER', status: 'PENDING' },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });

    // Create notification for invited user
    await prisma.notification.create({
      data: {
        userId,
        title: 'Team Invitation',
        message: `You have been invited to join team "${team.name}" for the tournament "${tournament.name}". Accept or decline from your Dashboard.`,
        type: 'team_invite',
        link: `/dashboard/my-teams`,
      },
    });

    return reply.code(201).send({ member });
  }

  // ── PATCH /api/tournaments/:id/teams/:teamId/members/me ─────────────────
  // Invited user accepts or declines their invitation.
  async respondToInvite(req, reply) {
    const { id: tournamentId, teamId } = req.params;
    const { action } = req.body; // 'accept' | 'decline'

    if (!['accept', 'decline'].includes(action)) {
      throw createError(400, "action must be 'accept' or 'decline'");
    }

    const team = await prisma.team.findFirst({ where: { id: teamId, tournamentId } });
    if (!team) throw createError(404, 'Team not found');

    const memberRecord = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: req.user.id } },
    });
    if (!memberRecord) throw createError(404, 'You have no pending invitation for this team');
    if (memberRecord.status !== 'PENDING') {
      throw createError(400, 'This invitation has already been responded to');
    }
    if (memberRecord.role === 'CAPTAIN') {
      throw createError(400, 'Captains cannot respond to their own invitation');
    }

    const newStatus = action === 'accept' ? 'ACCEPTED' : 'DECLINED';
    const updated = await prisma.teamMember.update({
      where: { teamId_userId: { teamId, userId: req.user.id } },
      data: { status: newStatus },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });

    return reply.send({ member: updated });
  }

  // ── DELETE /api/tournaments/:id/teams/:teamId/members/:userId ────────────
  // A member withdraws their own candidacy (or captain kicks a member).
  async removeMember(req, reply) {
    const { id: tournamentId, teamId, userId } = req.params;

    const team = await prisma.team.findFirst({ where: { id: teamId, tournamentId } });
    if (!team) throw createError(404, 'Team not found');

    const isSelf = req.user.id === userId;
    const isCaptain = await prisma.teamMember.findFirst({
      where: { teamId, userId: req.user.id, role: 'CAPTAIN' },
    });

    if (!isSelf && !isCaptain && req.user.role !== 'ADMIN') {
      throw createError(403, 'You can only remove yourself, or be the team captain');
    }

    // Captains cannot remove themselves — they must disband the team instead
    const targetMember = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
    if (!targetMember) throw createError(404, 'Member not found in team');
    if (targetMember.role === 'CAPTAIN' && isSelf) {
      throw createError(400, 'Team captain cannot leave. Disband the team instead.');
    }

    await prisma.teamMember.delete({ where: { teamId_userId: { teamId, userId } } });
    return reply.code(204).send();
  }

  // ── DELETE /api/tournaments/:id/teams/:teamId ────────────────────────────
  // Captain disbands the team (removes registration entirely).
  async disband(req, reply) {
    const { id: tournamentId, teamId } = req.params;

    const team = await prisma.team.findFirst({ where: { id: teamId, tournamentId } });
    if (!team) throw createError(404, 'Team not found');

    const isCaptain = await prisma.teamMember.findFirst({
      where: { teamId, userId: req.user.id, role: 'CAPTAIN' },
    });
    const isAdmin = req.user.role === 'ADMIN';
    if (!isCaptain && !isAdmin) {
      throw createError(403, 'Only the team captain or platform admin can disband a team');
    }

    await prisma.team.delete({ where: { id: teamId } });
    return reply.code(204).send();
  }

  // ── GET /api/tournaments/:id/teams/mine ─────────────────────────────────
  // Returns the current user's team in this specific tournament (if any).
  async getMyTeam(req, reply) {
    const { id: tournamentId } = req.params;

    const member = await prisma.teamMember.findFirst({
      where: {
        userId: req.user.id,
        team: { tournamentId },
      },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
              },
              orderBy: { joinedAt: 'asc' },
            },
          },
        },
      },
    });

    if (!member) return reply.send({ team: null, membership: null });
    return reply.send({ team: member.team, membership: member });
  }
}
