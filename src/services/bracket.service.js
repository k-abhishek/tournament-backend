import { prisma } from '../config/database.js';
import { createError } from '../utils/errors.js';

/**
 * Generates tournament brackets and persists Match records.
 * Supports: SINGLE_ELIMINATION, ROUND_ROBIN
 */
export class BracketService {
  /**
   * @param {{ id: string, format: string, participants: Array }} tournament
   */
  async generate(tournament) {
    const { id: tournamentId, format, participants } = tournament;

    if (!participants || participants.length < 2) {
      throw createError(400, 'At least 2 participants required to start the bracket');
    }

    // Shuffle participants for seeding
    const shuffled = [...participants].sort(() => Math.random() - 0.5);

    switch (format) {
      case 'SINGLE_ELIMINATION':
        return this.#generateSingleElimination(tournamentId, shuffled);
      case 'ROUND_ROBIN':
        return this.#generateRoundRobin(tournamentId, shuffled);
      default:
        throw createError(400, `Bracket generation for format "${format}" is not yet implemented`);
    }
  }

  async #generateSingleElimination(tournamentId, participants) {
    const rounds = Math.ceil(Math.log2(participants.length));
    const bracketSize = Math.pow(2, rounds);
    const seeded = [...participants];

    // Pad with byes if not a power of 2
    while (seeded.length < bracketSize) seeded.push(null);

    const matches = [];
    let matchNumber = 1;

    for (let i = 0; i < bracketSize; i += 2) {
      matches.push({
        tournamentId,
        round: 1,
        matchNumber: matchNumber++,
        p1Id: seeded[i]?.id ?? null,
        p2Id: seeded[i + 1]?.id ?? null,
        status: seeded[i] && seeded[i + 1] ? 'PENDING' : 'COMPLETED',
        winnerId: !seeded[i + 1] ? seeded[i]?.id : !seeded[i] ? seeded[i + 1]?.id : null,
      });
    }

    // Create subsequent round placeholder matches
    for (let round = 2; round <= rounds; round++) {
      const matchesInRound = Math.pow(2, rounds - round);
      for (let m = 0; m < matchesInRound; m++) {
        matches.push({ tournamentId, round, matchNumber: matchNumber++, status: 'PENDING' });
      }
    }

    await prisma.match.createMany({ data: matches });
    return matches;
  }

  async #generateRoundRobin(tournamentId, participants) {
    const n = participants.length;
    const list = n % 2 === 0 ? participants : [...participants, null]; // odd: add bye
    const total = list.length;
    const rounds = total - 1;
    const matchesPerRound = total / 2;
    const matches = [];
    let matchNumber = 1;

    for (let round = 1; round <= rounds; round++) {
      for (let m = 0; m < matchesPerRound; m++) {
        const p1 = list[m];
        const p2 = list[total - 1 - m];
        if (p1 && p2) {
          matches.push({
            tournamentId, round,
            matchNumber: matchNumber++,
            p1Id: p1.id, p2Id: p2.id,
            status: 'PENDING',
          });
        }
      }
      // Rotate the list (keep first element fixed)
      list.splice(1, 0, list.pop());
    }

    await prisma.match.createMany({ data: matches });
    return matches;
  }
}
