import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const gamesData = [
  {
    "id": "mobile_legends_bang_bang",
    "title": "Mobile Legends: Bang Bang",
    "genre": "Mobile MOBA",
    "platforms": ["Mobile"],
    "team_size": 5,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/10481336774806066342_0",
    "active": true
  },
  {
    "id": "league_of_legends",
    "title": "League of Legends",
    "genre": "MOBA",
    "platforms": ["PC"],
    "team_size": 5,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/16433235370008327377_0",
    "active": true
  },
  {
    "id": "counter_strike_2",
    "title": "Counter-Strike 2",
    "genre": "Tactical FPS",
    "platforms": ["PC"],
    "team_size": 5,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/4125962895799817825_0",
    "active": true
  },
  {
    "id": "dota_2",
    "title": "Dota 2",
    "genre": "MOBA",
    "platforms": ["PC"],
    "team_size": 5,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/4032390613425570984_0",
    "active": true
  },
  {
    "id": "valorant",
    "title": "Valorant",
    "genre": "Tactical FPS",
    "platforms": ["PC"],
    "team_size": 5,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/8967411759305577456_0",
    "active": true
  },
  {
    "id": "pubg_mobile",
    "title": "PUBG Mobile",
    "genre": "Battle Royale",
    "platforms": ["Mobile"],
    "team_size": 4,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/11690562624419992389_0",
    "active": true
  },
  {
    "id": "fortnite",
    "title": "Fortnite",
    "genre": "Battle Royale",
    "platforms": ["PC", "Console", "Mobile"],
    "team_size": 1,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/4462151624838645053_0",
    "active": true
  },
  {
    "id": "arena_of_valor",
    "title": "Arena of Valor",
    "genre": "Mobile MOBA",
    "platforms": ["Mobile"],
    "team_size": 5,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/3927266223407887788_0",
    "active": true
  },
  {
    "id": "pubg_battlegrounds",
    "title": "PUBG: Battlegrounds",
    "genre": "Battle Royale",
    "platforms": ["PC", "Console"],
    "team_size": 4,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/8097047172249293791_0",
    "active": true
  },
  {
    "id": "honor_of_kings",
    "title": "Honor of Kings",
    "genre": "Mobile MOBA",
    "platforms": ["Mobile"],
    "team_size": 5,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/13803623205490534102_0",
    "active": true
  },
  {
    "id": "free_fire",
    "title": "Free Fire",
    "genre": "Battle Royale",
    "platforms": ["Mobile"],
    "team_size": 4,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/7829656122288156840_0",
    "active": true
  },
  {
    "id": "apex_legends",
    "title": "Apex Legends",
    "genre": "Battle Royale",
    "platforms": ["PC", "Console"],
    "team_size": 3,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/17934641067909912878_0",
    "active": true
  },
  {
    "id": "rocket_league",
    "title": "Rocket League",
    "genre": "Sports / Vehicular",
    "platforms": ["PC", "Console"],
    "team_size": 3,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/6439184723636575983_0",
    "active": true
  },
  {
    "id": "rainbow_six_siege",
    "title": "Tom Clancy's Rainbow Six Siege",
    "genre": "Tactical FPS",
    "platforms": ["PC", "Console"],
    "team_size": 5,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/17549951335899978164_0",
    "active": true
  },
  {
    "id": "geoguessr",
    "title": "GeoGuessr",
    "genre": "Strategy / Geography",
    "platforms": ["Browser"],
    "team_size": 1,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/3869976619384726248_0",
    "active": true
  },
  {
    "id": "street_fighter",
    "title": "Street Fighter",
    "genre": "Fighting",
    "platforms": ["PC", "Console"],
    "team_size": 1,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/6908662621722181330_0",
    "active": true
  },
  {
    "id": "call_of_duty",
    "title": "Call of Duty",
    "genre": "FPS",
    "platforms": ["PC", "Console", "Mobile"],
    "team_size": 4,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/13463996801842711964_0",
    "active": true
  },
  {
    "id": "call_of_duty_warzone",
    "title": "Call of Duty: Warzone",
    "genre": "Battle Royale",
    "platforms": ["PC", "Console"],
    "team_size": 3,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/9688562296745223659_0",
    "active": true
  },
  {
    "id": "ea_sports_fc",
    "title": "EA Sports FC",
    "genre": "Sports",
    "platforms": ["PC", "Console"],
    "team_size": 1,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/16916346710477682103_0",
    "active": true
  },
  {
    "id": "tekken_8",
    "title": "Tekken 8",
    "genre": "Fighting",
    "platforms": ["PC", "Console"],
    "team_size": 1,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/2674138516332461368_0",
    "active": true
  },
  {
    "id": "teamfight_tactics",
    "title": "Teamfight Tactics",
    "genre": "Auto Battler",
    "platforms": ["PC", "Mobile"],
    "team_size": 1,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/15349639622067082030_0",
    "active": true
  },
  {
    "id": "formula_1",
    "title": "Formula 1 (Sim Racing)",
    "genre": "Sim Racing",
    "platforms": ["PC", "Console"],
    "team_size": 1,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/15851112347113689235_0",
    "active": true
  },
  {
    "id": "clash_royale",
    "title": "Clash Royale",
    "genre": "Mobile Strategy",
    "platforms": ["Mobile"],
    "team_size": 1,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/15545000297836992131_0",
    "active": true
  },
  {
    "id": "brawl_stars",
    "title": "Brawl Stars",
    "genre": "Mobile Action",
    "platforms": ["Mobile"],
    "team_size": 3,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/9239569695759259015_0",
    "active": true
  },
  {
    "id": "marvel_rivals",
    "title": "Marvel Rivals",
    "genre": "Hero Shooter",
    "platforms": ["PC", "Console"],
    "team_size": 6,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/5764221097881388711_0",
    "active": true
  },
  {
    "id": "overwatch_2",
    "title": "Overwatch 2",
    "genre": "Hero Shooter",
    "platforms": ["PC", "Console"],
    "team_size": 5,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/12147109534488015176_0",
    "active": true
  },
  {
    "id": "world_of_warcraft",
    "title": "World of Warcraft",
    "genre": "MMORPG / Arena PvP",
    "platforms": ["PC"],
    "team_size": 3,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/17152980946613336919_0",
    "active": true
  },
  {
    "id": "fatal_fury_cotw",
    "title": "Fatal Fury: City of the Wolves",
    "genre": "Fighting",
    "platforms": ["PC", "Console"],
    "team_size": 1,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/14010849220116370744_0",
    "active": true
  },
  {
    "id": "guilty_gear_strive",
    "title": "Guilty Gear -Strive-",
    "genre": "Fighting",
    "platforms": ["PC", "Console"],
    "team_size": 1,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/3005207993974610024_0",
    "active": true
  },
  {
    "id": "super_smash_bros_ultimate",
    "title": "Super Smash Bros. Ultimate",
    "genre": "Platform Fighter",
    "platforms": ["Nintendo Switch"],
    "team_size": 1,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/3846939575083130717_0",
    "active": true
  },
  {
    "id": "chess_esport",
    "title": "Chess as an Esport",
    "genre": "Strategy",
    "platforms": ["PC", "Mobile"],
    "team_size": 1,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/742609623826917237_0",
    "active": true
  },
  {
    "id": "microsoft_excel_world_championship",
    "title": "Microsoft Excel World Championship",
    "genre": "Financial Modeling / Esport",
    "platforms": ["PC"],
    "team_size": 1,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/4981806104962597923_0",
    "active": true
  },
  {
    "id": "speedrunning_tournaments",
    "title": "Speedrunning Tournaments",
    "genre": "Speedrun",
    "platforms": ["Multi-Platform"],
    "team_size": 1,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/13172442994862686895_0",
    "active": true
  }
];

const usersData = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    clerkId: 'user_2alex0001',
    username: 'alex_admin',
    displayName: 'Alex Mercer',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80',
    email: 'alex@tourneyhub.gg',
    role: 'ADMIN',
    bio: 'Lead Tournament Operations & Esports Coordinator'
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    clerkId: 'user_2sara0002',
    username: 'sarah_ops',
    displayName: 'Sarah Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    email: 'sara@tourneyhub.gg',
    role: 'ORGANIZER',
    bio: 'FPS Tournament Director & Broadcast Producer'
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    clerkId: 'user_2marcus003',
    username: 'marcus_mod',
    displayName: 'Marcus Brody',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    email: 'marcus@tourneyhub.gg',
    role: 'PLAYER',
    bio: 'Senior Competitive Referee & Rule Arbitrator'
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    clerkId: 'user_2elena004',
    username: 'elena_ref',
    displayName: 'Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    email: 'elena@tourneyhub.gg',
    role: 'PLAYER',
    bio: 'Tournament Moderator & Community Manager'
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    clerkId: 'user_tenz005',
    username: 'tenz',
    displayName: 'Tyson Ngo',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80',
    email: 'tenz@sentinels.gg',
    role: 'PLAYER'
  },
  {
    id: '66666666-6666-4666-8666-666666666666',
    clerkId: 'user_boaster006',
    username: 'boaster',
    displayName: 'Jake Howlett',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    email: 'boaster@fnatic.com',
    role: 'PLAYER'
  },
  {
    id: '77777777-7777-4777-8777-777777777777',
    clerkId: 'user_f0rsaken007',
    username: 'f0rsaken',
    displayName: 'Jason Susanto',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    email: 'f0rsaken@pprx.team',
    role: 'PLAYER'
  },
  {
    id: '88888888-8888-4888-8888-888888888888',
    clerkId: 'user_s1mple011',
    username: 's1mple',
    displayName: 'Oleksandr Kostyliev',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    email: 's1mple@navi.gg',
    role: 'PLAYER'
  },
  {
    id: '99999999-9999-4999-8999-999999999999',
    clerkId: 'user_karrigan012',
    username: 'karrigan',
    displayName: 'Finn Andersen',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    email: 'karrigan@faze.gg',
    role: 'PLAYER'
  },
  {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    clerkId: 'user_zywoo013',
    username: 'zywoo',
    displayName: 'Mathieu Herbaut',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    email: 'zywoo@vitality.gg',
    role: 'PLAYER'
  },
  {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    clerkId: 'user_m0nesy014',
    username: 'm0nesy',
    displayName: 'Ilya Osipov',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    email: 'm0nesy@g2.gg',
    role: 'PLAYER'
  },
  {
    id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    clerkId: 'user_vatira015',
    username: 'vatira',
    displayName: 'Axel Touret',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    email: 'vatira@karminecorp.fr',
    role: 'PLAYER'
  },
  {
    id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    clerkId: 'user_arslan017',
    username: 'arslan_ash',
    displayName: 'Arslan Ash',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    email: 'arslan@redbull.com',
    role: 'PLAYER'
  },
  {
    id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    clerkId: 'user_knee018',
    username: 'knee',
    displayName: 'Bae Jae-Min',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    email: 'knee@drx.gg',
    role: 'PLAYER'
  }
];

async function main() {
  console.log('Seeding games...');
  const gameMap = {};
  for (const game of gamesData) {
    const upserted = await prisma.game.upsert({
      where: { slug: game.id },
      update: {
        name: game.title,
        iconUrl: game.image_url,
        genre: game.genre,
        platforms: game.platforms,
        teamSize: game.team_size,
        active: game.active
      },
      create: {
        slug: game.id,
        name: game.title,
        iconUrl: game.image_url,
        genre: game.genre,
        platforms: game.platforms,
        teamSize: game.team_size,
        active: game.active
      }
    });
    gameMap[game.id] = upserted;
  }
  console.log('Successfully seeded games!');

  console.log('Seeding users...');
  const userMap = {};
  for (const u of usersData) {
    const upserted = await prisma.user.upsert({
      where: { clerkId: u.clerkId },
      update: {
        username: u.username,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl,
        email: u.email,
        role: u.role,
        bio: u.bio
      },
      create: {
        id: u.id,
        clerkId: u.clerkId,
        username: u.username,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl,
        email: u.email,
        role: u.role,
        bio: u.bio
      }
    });
    userMap[u.username] = upserted;
  }
  console.log('Successfully seeded users!');

  async function seedModerators(tournamentId, userIds) {
    await prisma.tournamentModerator.deleteMany({ where: { tournamentId } });
    for (const userId of userIds) {
      await prisma.tournamentModerator.create({
        data: { tournamentId, userId }
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Tournament 1: VALORANT Masters: Neo-Tokyo 2026 (Double Elimination, ONGOING)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('Seeding Tournament 1: Valorant Masters...');
  const t1 = await prisma.tournament.upsert({
    where: { slug: 'valorant-masters-neo-tokyo-2026' },
    update: {
      name: 'VALORANT Masters: Neo-Tokyo 2026',
      description: 'The premier international VALORANT championship featuring top 8 tier-1 teams competing across a double elimination bracket for glory, circuit points, and $50,000 USD.',
      rules: '1. Match Format: Best of 3 (BO3) across all upper & lower rounds; Best of 5 (BO5) for Lower Final and Grand Final.\n2. Map Pool: Ascent, Bind, Haven, Sunset, Lotus, Icebox, Abyss.\n3. Tactical Pauses: 2 timeouts (60 seconds each) per team per map.',
      bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      gameId: gameMap['valorant'].id,
      organizerId: userMap['alex_admin'].id,
      format: 'DOUBLE_ELIMINATION',
      status: 'ONGOING',
      maxParticipants: 8,
      isTeamBased: true,
      teamSize: 5,
      prizePool: 50000,
      startDate: new Date('2026-10-24T10:00:00Z'),
      endDate: new Date('2026-10-28T22:00:00Z'),
      registrationDeadline: new Date('2026-10-22T23:59:59Z'),
    },
    create: {
      id: 'a0000001-0001-4001-8001-000000000001',
      slug: 'valorant-masters-neo-tokyo-2026',
      name: 'VALORANT Masters: Neo-Tokyo 2026',
      description: 'The premier international VALORANT championship featuring top 8 tier-1 teams competing across a double elimination bracket for glory, circuit points, and $50,000 USD.',
      rules: '1. Match Format: Best of 3 (BO3) across all upper & lower rounds; Best of 5 (BO5) for Lower Final and Grand Final.\n2. Map Pool: Ascent, Bind, Haven, Sunset, Lotus, Icebox, Abyss.\n3. Tactical Pauses: 2 timeouts (60 seconds each) per team per map.',
      bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      gameId: gameMap['valorant'].id,
      organizerId: userMap['alex_admin'].id,
      format: 'DOUBLE_ELIMINATION',
      status: 'ONGOING',
      maxParticipants: 8,
      isTeamBased: true,
      teamSize: 5,
      prizePool: 50000,
      startDate: new Date('2026-10-24T10:00:00Z'),
      endDate: new Date('2026-10-28T22:00:00Z'),
      registrationDeadline: new Date('2026-10-22T23:59:59Z'),
    }
  });
  await seedModerators(t1.id, [userMap['sarah_ops'].id, userMap['marcus_mod'].id]);

  await prisma.matchResult.deleteMany({ where: { match: { tournamentId: t1.id } } });
  await prisma.match.deleteMany({ where: { tournamentId: t1.id } });
  await prisma.participant.deleteMany({ where: { tournamentId: t1.id } });
  await prisma.teamMember.deleteMany({ where: { team: { tournamentId: t1.id } } });
  await prisma.team.deleteMany({ where: { tournamentId: t1.id } });

  const valTeamsData = [
    { name: 'Sentinels', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', seed: 1, captain: userMap['tenz'] },
    { name: 'Fnatic', logoUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=100&auto=format&fit=crop&q=80', seed: 2, captain: userMap['boaster'] },
    { name: 'Paper Rex', logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&auto=format&fit=crop&q=80', seed: 3, captain: userMap['f0rsaken'] },
    { name: 'DRX Vision', logoUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=100&auto=format&fit=crop&q=80', seed: 4 },
    { name: 'LOUD Esports', logoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&auto=format&fit=crop&q=80', seed: 5 },
    { name: 'EDward Gaming', logoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&auto=format&fit=crop&q=80', seed: 6 },
    { name: 'Team Liquid', logoUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80', seed: 7 },
    { name: 'Team Heretics', logoUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=100&auto=format&fit=crop&q=80', seed: 8 },
  ];

  const valPartMap = [];
  for (const td of valTeamsData) {
    const team = await prisma.team.create({
      data: {
        name: td.name,
        logoUrl: td.logoUrl,
        tournamentId: t1.id,
      }
    });
    if (td.captain) {
      await prisma.teamMember.create({
        data: {
          teamId: team.id,
          userId: td.captain.id,
          role: 'CAPTAIN',
          status: 'ACCEPTED'
        }
      });
    }
    const part = await prisma.participant.create({
      data: {
        tournamentId: t1.id,
        teamId: team.id,
        seed: td.seed,
        status: 'CHECKED_IN'
      }
    });
    valPartMap.push(part);
  }

  const t1Matches = [
    { round: 1, matchNumber: 1, p1: valPartMap[0], p2: valPartMap[7], winner: valPartMap[0], s1: 2, s2: 0, status: 'COMPLETED', notes: 'Sentinels won Haven (13-9) and Bind (13-7)' },
    { round: 1, matchNumber: 2, p1: valPartMap[3], p2: valPartMap[4], winner: valPartMap[3], s1: 2, s2: 1, status: 'COMPLETED', notes: 'Overtime thriller on Sunset (15-13 DRX)' },
    { round: 1, matchNumber: 3, p1: valPartMap[1], p2: valPartMap[6], winner: valPartMap[1], s1: 2, s2: 0, status: 'COMPLETED', notes: 'Fnatic clean sweep on Ascent (13-6) & Lotus (13-8)' },
    { round: 1, matchNumber: 4, p1: valPartMap[2], p2: valPartMap[5], winner: valPartMap[2], s1: 2, s2: 1, status: 'COMPLETED', notes: 'Paper Rex clutch on Abyss decider map (13-11)' },
    { round: 2, matchNumber: 5, p1: valPartMap[0], p2: valPartMap[3], winner: valPartMap[0], s1: 2, s2: 1, status: 'COMPLETED', notes: 'Sentinels advance to Upper Final (2-1)' },
    { round: 2, matchNumber: 6, p1: valPartMap[1], p2: valPartMap[2], winner: null, s1: 1, s2: 1, status: 'ONGOING', notes: 'DECIDER MAP LIVE: Fnatic vs Paper Rex on Haven (Tied 1-1)' },
    { round: 3, matchNumber: 7, p1: valPartMap[0], p2: null, winner: null, s1: null, s2: null, status: 'PENDING', notes: 'Sentinels awaits winner of Fnatic vs Paper Rex' },
    { round: 4, matchNumber: 8, p1: null, p2: null, winner: null, s1: null, s2: null, status: 'PENDING', notes: 'Best of 5 Championship Decider' },
  ];

  for (const m of t1Matches) {
    const createdMatch = await prisma.match.create({
      data: {
        tournamentId: t1.id,
        round: m.round,
        matchNumber: m.matchNumber,
        p1Id: m.p1?.id ?? null,
        p2Id: m.p2?.id ?? null,
        winnerId: m.winner?.id ?? null,
        status: m.status,
        notes: m.notes,
        scheduledAt: new Date(),
        completedAt: m.status === 'COMPLETED' ? new Date() : null,
      }
    });
    if (m.s1 !== null && m.p1) {
      await prisma.matchResult.create({
        data: {
          matchId: createdMatch.id,
          participantId: m.p1.id,
          score: m.s1,
          reportedById: userMap['alex_admin'].id
        }
      });
    }
    if (m.s2 !== null && m.p2) {
      await prisma.matchResult.create({
        data: {
          matchId: createdMatch.id,
          participantId: m.p2.id,
          score: m.s2,
          reportedById: userMap['alex_admin'].id
        }
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Tournament 2: CS2 Global Major: Stockholm Clash (Single Elimination, ONGOING)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('Seeding Tournament 2: CS2 Major...');
  const t2 = await prisma.tournament.upsert({
    where: { slug: 'cs2-global-major-stockholm-2026' },
    update: {
      name: 'CS2 Global Major: Stockholm Clash',
      description: 'High-stakes Counter-Strike 2 championship bringing together legendary European and North American powerhouses for an intense single elimination showdown.',
      rules: '1. Valve Official Competitive Rules apply.\n2. MR12 format with 3 overtime rounds per side (10k start money).\n3. Anti-cheat: Akros + VAC verified tournament clients mandatory.',
      bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
      gameId: gameMap['counter_strike_2'].id,
      organizerId: userMap['sarah_ops'].id,
      format: 'SINGLE_ELIMINATION',
      status: 'ONGOING',
      maxParticipants: 8,
      isTeamBased: true,
      teamSize: 5,
      prizePool: 100000,
      startDate: new Date('2026-10-24T12:00:00Z'),
      endDate: new Date('2026-10-27T20:00:00Z'),
      registrationDeadline: new Date('2026-10-20T23:59:59Z'),
    },
    create: {
      id: 'a0000002-0002-4002-8002-000000000002',
      slug: 'cs2-global-major-stockholm-2026',
      name: 'CS2 Global Major: Stockholm Clash',
      description: 'High-stakes Counter-Strike 2 championship bringing together legendary European and North American powerhouses for an intense single elimination showdown.',
      rules: '1. Valve Official Competitive Rules apply.\n2. MR12 format with 3 overtime rounds per side (10k start money).\n3. Anti-cheat: Akros + VAC verified tournament clients mandatory.',
      bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
      gameId: gameMap['counter_strike_2'].id,
      organizerId: userMap['sarah_ops'].id,
      format: 'SINGLE_ELIMINATION',
      status: 'ONGOING',
      maxParticipants: 8,
      isTeamBased: true,
      teamSize: 5,
      prizePool: 100000,
      startDate: new Date('2026-10-24T12:00:00Z'),
      endDate: new Date('2026-10-27T20:00:00Z'),
      registrationDeadline: new Date('2026-10-20T23:59:59Z'),
    }
  });
  await seedModerators(t2.id, [userMap['marcus_mod'].id]);

  await prisma.matchResult.deleteMany({ where: { match: { tournamentId: t2.id } } });
  await prisma.match.deleteMany({ where: { tournamentId: t2.id } });
  await prisma.participant.deleteMany({ where: { tournamentId: t2.id } });
  await prisma.teamMember.deleteMany({ where: { team: { tournamentId: t2.id } } });
  await prisma.team.deleteMany({ where: { tournamentId: t2.id } });

  const csTeamsData = [
    { name: 'Natus Vincere', logoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&auto=format&fit=crop&q=80', seed: 1, captain: userMap['s1mple'] },
    { name: 'FaZe Clan', logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&auto=format&fit=crop&q=80', seed: 2, captain: userMap['karrigan'] },
    { name: 'Team Vitality', logoUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=100&auto=format&fit=crop&q=80', seed: 3, captain: userMap['zywoo'] },
    { name: 'G2 Esports', logoUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=100&auto=format&fit=crop&q=80', seed: 4, captain: userMap['m0nesy'] },
    { name: 'MOUZ', logoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&auto=format&fit=crop&q=80', seed: 5 },
    { name: 'Heroic', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', seed: 6 },
    { name: 'Cloud9', logoUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80', seed: 7 },
    { name: 'Astralis', logoUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=100&auto=format&fit=crop&q=80', seed: 8 },
  ];

  const csPartMap = [];
  for (const td of csTeamsData) {
    const team = await prisma.team.create({
      data: {
        name: td.name,
        logoUrl: td.logoUrl,
        tournamentId: t2.id,
      }
    });
    if (td.captain) {
      await prisma.teamMember.create({
        data: {
          teamId: team.id,
          userId: td.captain.id,
          role: 'CAPTAIN',
          status: 'ACCEPTED'
        }
      });
    }
    const part = await prisma.participant.create({
      data: {
        tournamentId: t2.id,
        teamId: team.id,
        seed: td.seed,
        status: 'CHECKED_IN'
      }
    });
    csPartMap.push(part);
  }

  const t2Matches = [
    { round: 1, matchNumber: 1, p1: csPartMap[0], p2: csPartMap[7], winner: csPartMap[0], s1: 2, s2: 0, status: 'COMPLETED', notes: 'NAVI dominants Mirage (13-4) & Nuke (13-8)' },
    { round: 1, matchNumber: 2, p1: csPartMap[3], p2: csPartMap[4], winner: csPartMap[3], s1: 2, s2: 1, status: 'COMPLETED', notes: 'G2 edge out MOUZ on Inferno (16-14 OT)' },
    { round: 1, matchNumber: 3, p1: csPartMap[1], p2: csPartMap[6], winner: csPartMap[1], s1: 2, s2: 0, status: 'COMPLETED', notes: 'FaZe Clan tactical masterclass on Ancient' },
    { round: 1, matchNumber: 4, p1: csPartMap[2], p2: csPartMap[5], winner: csPartMap[2], s1: 2, s2: 1, status: 'COMPLETED', notes: 'Vitality secure semifinal spot after 3 maps' },
    { round: 2, matchNumber: 5, p1: csPartMap[0], p2: csPartMap[3], winner: csPartMap[0], s1: 2, s2: 1, status: 'COMPLETED', notes: 'NAVI punches ticket to Grand Final' },
    { round: 2, matchNumber: 6, p1: csPartMap[1], p2: csPartMap[2], winner: null, s1: 1, s2: 1, status: 'ONGOING', notes: 'LIVE: FaZe Clan 1 - 1 Team Vitality. Decider Map Dust II underway' },
    { round: 3, matchNumber: 7, p1: csPartMap[0], p2: null, winner: null, s1: null, s2: null, status: 'PENDING', notes: 'NAVI vs Semifinal 2 Winner for $100,000 Major Trophy' },
  ];

  for (const m of t2Matches) {
    const createdMatch = await prisma.match.create({
      data: {
        tournamentId: t2.id,
        round: m.round,
        matchNumber: m.matchNumber,
        p1Id: m.p1?.id ?? null,
        p2Id: m.p2?.id ?? null,
        winnerId: m.winner?.id ?? null,
        status: m.status,
        notes: m.notes,
        scheduledAt: new Date(),
        completedAt: m.status === 'COMPLETED' ? new Date() : null,
      }
    });
    if (m.s1 !== null && m.p1) {
      await prisma.matchResult.create({
        data: {
          matchId: createdMatch.id,
          participantId: m.p1.id,
          score: m.s1,
          reportedById: userMap['sarah_ops'].id
        }
      });
    }
    if (m.s2 !== null && m.p2) {
      await prisma.matchResult.create({
        data: {
          matchId: createdMatch.id,
          participantId: m.p2.id,
          score: m.s2,
          reportedById: userMap['sarah_ops'].id
        }
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Tournament 3: Rocket League Championship: Apex Invitational (COMPLETED)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('Seeding Tournament 3: Rocket League...');
  const t3 = await prisma.tournament.upsert({
    where: { slug: 'rlcs-apex-invitational-2026' },
    update: {
      name: 'Rocket League Championship: Apex Invitational',
      description: 'High-velocity 3v3 aerial action in the seasonal invitational. Karmine Corp emerged victorious after a dominant playoff run.',
      rules: '1. 5-minute standard regulation matches.\n2. Standard arena rotation: DFH Stadium, Champions Field, Mannfield.\n3. Single elimination bracket, BO7 Finals.',
      bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
      gameId: gameMap['rocket_league'].id,
      organizerId: userMap['sarah_ops'].id,
      format: 'SINGLE_ELIMINATION',
      status: 'COMPLETED',
      maxParticipants: 4,
      isTeamBased: true,
      teamSize: 3,
      prizePool: 15000,
      startDate: new Date('2026-10-20T16:00:00Z'),
      endDate: new Date('2026-10-20T21:00:00Z'),
      registrationDeadline: new Date('2026-10-18T23:59:59Z'),
    },
    create: {
      id: 'a0000003-0003-4003-8003-000000000003',
      slug: 'rlcs-apex-invitational-2026',
      name: 'Rocket League Championship: Apex Invitational',
      description: 'High-velocity 3v3 aerial action in the seasonal invitational. Karmine Corp emerged victorious after a dominant playoff run.',
      rules: '1. 5-minute standard regulation matches.\n2. Standard arena rotation: DFH Stadium, Champions Field, Mannfield.\n3. Single elimination bracket, BO7 Finals.',
      bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
      gameId: gameMap['rocket_league'].id,
      organizerId: userMap['sarah_ops'].id,
      format: 'SINGLE_ELIMINATION',
      status: 'COMPLETED',
      maxParticipants: 4,
      isTeamBased: true,
      teamSize: 3,
      prizePool: 15000,
      startDate: new Date('2026-10-20T16:00:00Z'),
      endDate: new Date('2026-10-20T21:00:00Z'),
      registrationDeadline: new Date('2026-10-18T23:59:59Z'),
    }
  });
  await seedModerators(t3.id, [userMap['marcus_mod'].id]);

  await prisma.matchResult.deleteMany({ where: { match: { tournamentId: t3.id } } });
  await prisma.match.deleteMany({ where: { tournamentId: t3.id } });
  await prisma.participant.deleteMany({ where: { tournamentId: t3.id } });
  await prisma.teamMember.deleteMany({ where: { team: { tournamentId: t3.id } } });
  await prisma.team.deleteMany({ where: { tournamentId: t3.id } });

  const rlTeamsData = [
    { name: 'Karmine Corp', logoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&auto=format&fit=crop&q=80', seed: 1, captain: userMap['vatira'], status: 'WINNER' },
    { name: 'Team BDS', logoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&auto=format&fit=crop&q=80', seed: 2, status: 'CHECKED_IN' },
    { name: 'NRG Esports', logoUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=100&auto=format&fit=crop&q=80', seed: 3, status: 'CHECKED_IN' },
    { name: 'Spacestation Gaming', logoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&auto=format&fit=crop&q=80', seed: 4, status: 'CHECKED_IN' },
  ];

  const rlPartMap = [];
  for (const td of rlTeamsData) {
    const team = await prisma.team.create({
      data: {
        name: td.name,
        logoUrl: td.logoUrl,
        tournamentId: t3.id,
      }
    });
    if (td.captain) {
      await prisma.teamMember.create({
        data: {
          teamId: team.id,
          userId: td.captain.id,
          role: 'CAPTAIN',
          status: 'ACCEPTED'
        }
      });
    }
    const part = await prisma.participant.create({
      data: {
        tournamentId: t3.id,
        teamId: team.id,
        seed: td.seed,
        status: td.status
      }
    });
    rlPartMap.push(part);
  }

  const t3Matches = [
    { round: 1, matchNumber: 1, p1: rlPartMap[0], p2: rlPartMap[3], winner: rlPartMap[0], s1: 4, s2: 1, status: 'COMPLETED', notes: 'Karmine Corp dominate series 4-1' },
    { round: 1, matchNumber: 2, p1: rlPartMap[1], p2: rlPartMap[2], winner: rlPartMap[1], s1: 4, s2: 3, status: 'COMPLETED', notes: 'Game 7 overtime winner by Team BDS' },
    { round: 2, matchNumber: 3, p1: rlPartMap[0], p2: rlPartMap[1], winner: rlPartMap[0], s1: 4, s2: 2, status: 'COMPLETED', notes: 'Karmine Corp crowned RLCS Apex Champions!' },
  ];

  for (const m of t3Matches) {
    const createdMatch = await prisma.match.create({
      data: {
        tournamentId: t3.id,
        round: m.round,
        matchNumber: m.matchNumber,
        p1Id: m.p1?.id ?? null,
        p2Id: m.p2?.id ?? null,
        winnerId: m.winner?.id ?? null,
        status: m.status,
        notes: m.notes,
        scheduledAt: new Date('2026-10-20T16:00:00Z'),
        completedAt: new Date('2026-10-20T20:25:00Z'),
      }
    });
    if (m.s1 !== null && m.p1) {
      await prisma.matchResult.create({
        data: {
          matchId: createdMatch.id,
          participantId: m.p1.id,
          score: m.s1,
          reportedById: userMap['sarah_ops'].id
        }
      });
    }
    if (m.s2 !== null && m.p2) {
      await prisma.matchResult.create({
        data: {
          matchId: createdMatch.id,
          participantId: m.p2.id,
          score: m.s2,
          reportedById: userMap['sarah_ops'].id
        }
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Tournament 4: Apex Legends Global Series: Winter Split (REGISTRATION_OPEN)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('Seeding Tournament 4: Apex Legends...');
  const t4 = await prisma.tournament.upsert({
    where: { slug: 'apex-legends-winter-split-2026' },
    update: {
      name: 'Apex Legends Global Series: Winter Split',
      description: 'Open qualifying Swiss-system competition for 16 trios battling across World’s Edge and Storm Point to qualify for the Global Championship.',
      rules: '1. Scoring: Match placement points + 1 point per kill.\n2. Swiss rotation: 5 rounds of 3 matches each.\n3. Disconnections: 5 minute grace period before ring 1 closes.',
      bannerUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
      gameId: gameMap['apex_legends'].id,
      organizerId: userMap['alex_admin'].id,
      format: 'SWISS',
      status: 'REGISTRATION_OPEN',
      maxParticipants: 16,
      isTeamBased: true,
      teamSize: 3,
      prizePool: 25000,
      startDate: new Date('2026-11-05T16:00:00Z'),
      endDate: new Date('2026-11-08T22:00:00Z'),
      registrationDeadline: new Date('2026-11-03T23:59:59Z'),
    },
    create: {
      id: 'a0000004-0004-4004-8004-000000000004',
      slug: 'apex-legends-winter-split-2026',
      name: 'Apex Legends Global Series: Winter Split',
      description: 'Open qualifying Swiss-system competition for 16 trios battling across World’s Edge and Storm Point to qualify for the Global Championship.',
      rules: '1. Scoring: Match placement points + 1 point per kill.\n2. Swiss rotation: 5 rounds of 3 matches each.\n3. Disconnections: 5 minute grace period before ring 1 closes.',
      bannerUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
      gameId: gameMap['apex_legends'].id,
      organizerId: userMap['alex_admin'].id,
      format: 'SWISS',
      status: 'REGISTRATION_OPEN',
      maxParticipants: 16,
      isTeamBased: true,
      teamSize: 3,
      prizePool: 25000,
      startDate: new Date('2026-11-05T16:00:00Z'),
      endDate: new Date('2026-11-08T22:00:00Z'),
      registrationDeadline: new Date('2026-11-03T23:59:59Z'),
    }
  });
  await seedModerators(t4.id, [userMap['elena_ref'].id]);

  await prisma.participant.deleteMany({ where: { tournamentId: t4.id } });
  await prisma.teamMember.deleteMany({ where: { team: { tournamentId: t4.id } } });
  await prisma.team.deleteMany({ where: { tournamentId: t4.id } });

  const apexTeams = ['TSM', 'DarkZero', 'Alliance', 'Team Falcons', 'Fnatic Apex', 'NRG'];
  for (let i = 0; i < apexTeams.length; i++) {
    const tm = await prisma.team.create({
      data: {
        name: apexTeams[i],
        tournamentId: t4.id,
      }
    });
    await prisma.participant.create({
      data: {
        tournamentId: t4.id,
        teamId: tm.id,
        seed: i + 1,
        status: 'REGISTERED'
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Tournament 5: Tekken 8: King of Iron Fist Invitational (REGISTRATION_OPEN)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('Seeding Tournament 5: Tekken 8...');
  const t5 = await prisma.tournament.upsert({
    where: { slug: 'tekken-8-iron-fist-2026' },
    update: {
      name: 'Tekken 8: King of Iron Fist Invitational',
      description: '1v1 duel tournament featuring premier fighting game community athletes. Double elimination, 60 FPS locked, official tournament mode.',
      rules: '1. Best of 5 rounds per game, Best of 3 games until Top 8 (BO5).\n2. Random stage select for Game 1; loser picks stage for subsequent games.',
      bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
      gameId: gameMap['tekken_8'].id,
      organizerId: userMap['alex_admin'].id,
      format: 'DOUBLE_ELIMINATION',
      status: 'REGISTRATION_OPEN',
      maxParticipants: 16,
      isTeamBased: false,
      teamSize: 1,
      prizePool: 10000,
      startDate: new Date('2026-11-12T14:00:00Z'),
      endDate: new Date('2026-11-14T20:00:00Z'),
      registrationDeadline: new Date('2026-11-10T23:59:59Z'),
    },
    create: {
      id: 'a0000005-0005-4005-8005-000000000005',
      slug: 'tekken-8-iron-fist-2026',
      name: 'Tekken 8: King of Iron Fist Invitational',
      description: '1v1 duel tournament featuring premier fighting game community athletes. Double elimination, 60 FPS locked, official tournament mode.',
      rules: '1. Best of 5 rounds per game, Best of 3 games until Top 8 (BO5).\n2. Random stage select for Game 1; loser picks stage for subsequent games.',
      bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
      gameId: gameMap['tekken_8'].id,
      organizerId: userMap['alex_admin'].id,
      format: 'DOUBLE_ELIMINATION',
      status: 'REGISTRATION_OPEN',
      maxParticipants: 16,
      isTeamBased: false,
      teamSize: 1,
      prizePool: 10000,
      startDate: new Date('2026-11-12T14:00:00Z'),
      endDate: new Date('2026-11-14T20:00:00Z'),
      registrationDeadline: new Date('2026-11-10T23:59:59Z'),
    }
  });
  await seedModerators(t5.id, [userMap['elena_ref'].id]);

  await prisma.participant.deleteMany({ where: { tournamentId: t5.id } });
  await prisma.participant.create({
    data: {
      tournamentId: t5.id,
      userId: userMap['arslan_ash'].id,
      seed: 1,
      status: 'REGISTERED'
    }
  });
  await prisma.participant.create({
    data: {
      tournamentId: t5.id,
      userId: userMap['knee'].id,
      seed: 2,
      status: 'REGISTERED'
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Tournament 6: Dota 2: Aegis Champions League (Round Robin, ONGOING)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('Seeding Tournament 6: Dota 2...');
  const t6 = await prisma.tournament.upsert({
    where: { slug: 'dota-2-aegis-champions-league' },
    update: {
      name: 'Dota 2: Aegis Champions League',
      description: 'Round-robin showdown among international titans competing on the latest patch for the Aegis Cup.',
      rules: '1. Captains Mode drafting.\n2. Coin toss determines first pick/side selection.\n3. 15-minute standing delay for spectator broadcast.',
      bannerUrl: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1200&auto=format&fit=crop&q=80',
      gameId: gameMap['dota_2'].id,
      organizerId: userMap['sarah_ops'].id,
      format: 'ROUND_ROBIN',
      status: 'ONGOING',
      maxParticipants: 6,
      isTeamBased: true,
      teamSize: 5,
      prizePool: 30000,
      startDate: new Date('2026-10-22T13:00:00Z'),
      endDate: new Date('2026-10-29T21:00:00Z'),
      registrationDeadline: new Date('2026-10-19T23:59:59Z'),
    },
    create: {
      id: 'a0000006-0006-4006-8006-000000000006',
      slug: 'dota-2-aegis-champions-league',
      name: 'Dota 2: Aegis Champions League',
      description: 'Round-robin showdown among international titans competing on the latest patch for the Aegis Cup.',
      rules: '1. Captains Mode drafting.\n2. Coin toss determines first pick/side selection.\n3. 15-minute standing delay for spectator broadcast.',
      bannerUrl: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1200&auto=format&fit=crop&q=80',
      gameId: gameMap['dota_2'].id,
      organizerId: userMap['sarah_ops'].id,
      format: 'ROUND_ROBIN',
      status: 'ONGOING',
      maxParticipants: 6,
      isTeamBased: true,
      teamSize: 5,
      prizePool: 30000,
      startDate: new Date('2026-10-22T13:00:00Z'),
      endDate: new Date('2026-10-29T21:00:00Z'),
      registrationDeadline: new Date('2026-10-19T23:59:59Z'),
    }
  });
  await seedModerators(t6.id, [userMap['marcus_mod'].id]);

  await prisma.participant.deleteMany({ where: { tournamentId: t6.id } });
  await prisma.teamMember.deleteMany({ where: { team: { tournamentId: t6.id } } });
  await prisma.team.deleteMany({ where: { tournamentId: t6.id } });

  const dotaTeams = ['Team Spirit', 'Gaimin Gladiators', 'Team Liquid', 'BetBoom Team', 'Xtreme Gaming', 'Team Falcons'];
  for (let i = 0; i < dotaTeams.length; i++) {
    const tm = await prisma.team.create({
      data: {
        name: dotaTeams[i],
        tournamentId: t6.id,
      }
    });
    await prisma.participant.create({
      data: {
        tournamentId: t6.id,
        teamId: tm.id,
        seed: i + 1,
        status: 'CHECKED_IN'
      }
    });
  }

  console.log('All 6 tournaments seeded successfully with teams, brackets, matches and participants!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
