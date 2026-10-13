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
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/1518223288382568377_0",
    "active": true
  },
  {
    "id": "fortnite",
    "title": "Fortnite",
    "genre": "Battle Royale",
    "platforms": ["PC", "Console", "Mobile"],
    "team_size": 3,
    "image_url": "http://googleusercontent.com/image_collection/image_retrieval/8307670810970609379_0",
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
    "title": "Tom Clancy’s Rainbow Six Siege",
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

async function main() {
  console.log('Seeding games...');
  for (const game of gamesData) {
    await prisma.game.upsert({
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
  }
  console.log('Successfully seeded games!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
