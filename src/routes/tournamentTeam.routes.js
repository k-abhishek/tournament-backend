import { TournamentTeamController } from '../controllers/tournamentTeam.controller.js';
import { authenticate } from '../middleware/authenticate.js';

/**
 * Tournament-scoped team routes.
 * Mounted under: /api/tournaments/:id/teams
 */
export default async function tournamentTeamRoutes(app) {
  const ctrl = new TournamentTeamController();

  // List all teams in a tournament (public)
  app.get('/', ctrl.list.bind(ctrl));

  // Get current user's team in this tournament (auth required)
  app.get('/mine', { preHandler: [authenticate] }, ctrl.getMyTeam.bind(ctrl));

  // Register a new team (auth required — caller becomes CAPTAIN)
  app.post('/', { preHandler: [authenticate] }, ctrl.create.bind(ctrl));

  // Invite a member to the team (captain only)
  app.post('/:teamId/members', { preHandler: [authenticate] }, ctrl.inviteMember.bind(ctrl));

  // Accept or decline an invitation (invited user)
  app.patch('/:teamId/members/me', { preHandler: [authenticate] }, ctrl.respondToInvite.bind(ctrl));

  // Remove a member / withdraw candidacy
  app.delete('/:teamId/members/:userId', { preHandler: [authenticate] }, ctrl.removeMember.bind(ctrl));

  // Disband the entire team (captain only)
  app.delete('/:teamId', { preHandler: [authenticate] }, ctrl.disband.bind(ctrl));
}
