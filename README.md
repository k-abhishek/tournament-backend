# 🎮 Gaming Tournament Platform — Backend API

A high-performance, event-driven REST API for managing esports and gaming tournaments. Built with **Node.js**, **Fastify**, **Prisma ORM**, **PostgreSQL**, **BullMQ**, and **Clerk Authentication**.

---

## 🚀 Overview

The **Tournament Platform API** powers both solo and team-based tournament lifecycles. It provides automated bracket generation, match scheduling, real-time participant registration, role-based moderation, and event-driven background job processing.

### ✨ Key Features

- **🏆 Tournament Management**: Full tournament lifecycle management (`DRAFT`, `REGISTRATION_OPEN`, `REGISTRATION_CLOSED`, `ONGOING`, `COMPLETED`, `CANCELLED`).
- **🔀 Bracket Generation**: Automated bracket seeding and match progression for **Single Elimination** and **Round Robin** formats (with byes handling).
- **👥 Teams & Solo Participants**: Supports solo registrations and team rosters with team size limits and seeding.
- **🛡️ Authentication & RBAC**: Integrated with **Clerk** for authentication (Bearer JWT) and role-based authorization (`PLAYER`, `ORGANIZER`, `ADMIN`, plus tournament-specific `MODERATOR`).
- **🪝 Clerk Webhook Sync**: Real-time user lifecycle syncing (`user.created`, `user.updated`, `user.deleted`) verified using cryptographic **Svix** signatures.
- **⚡ Background Queues**: Asynchronous email notifications and background task processing via **BullMQ** & **Redis** (gracefully disabled in local development if Redis is unavailable).
- **🔒 Security & Performance**: Pre-configured with **Fastify Helmet**, **Rate Limiting** (200 req/min), and flexible **CORS** supporting production and Vercel preview environments.
- **📖 Interactive API Docs**: Built-in Swagger UI documentation available at `/docs`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime & Framework** | [Node.js](https://nodejs.org/) (ES Modules) + [Fastify](https://fastify.dev/) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/) |
| **Authentication** | [Clerk Backend SDK](https://clerk.com/) (`@clerk/backend`) |
| **Webhooks** | [Svix](https://www.svix.com/) |
| **Queue & Cache** | [BullMQ](https://docs.bullmq.io/) + [ioredis](https://github.com/redis/ioredis) |
| **Validation** | [Zod](https://zod.dev/) |
| **API Documentation** | [Swagger (OpenAPI 3.0)](https://swagger.io/) + [@fastify/swagger-ui](https://github.com/fastify/fastify-swagger-ui) |

---

## 📁 Project Structure

```text
tournament-backend/
├── prisma/
│   ├── schema.prisma        # Database schema, enums, models, and relations
│   └── seed.js              # Comprehensive database seed script (6 games, users, tournaments)
├── src/
│   ├── config/              # Database, Redis, and Clerk client configurations
│   ├── controllers/         # Request handling and controller business logic
│   ├── middleware/          # Auth guards (requireAuth, requireRole), webhook verifiers
│   ├── routes/              # Fastify route definitions (REST endpoints)
│   ├── services/            # Core business domains (e.g., BracketService)
│   ├── utils/               # Error handling, mailers, and helpers
│   ├── worker/              # BullMQ queue definitions and worker processors
│   └── server.js            # Fastify server initialization and plugin registration
├── .env.example             # Template for local environment variables
├── package.json             # Scripts and dependencies
└── README.md                # Project documentation
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory modeled after `.env.example`:

```ini
# Server
NODE_ENV=development
PORT=3001
HOST=0.0.0.0

# Database (PostgreSQL / Neon / Supabase)
DATABASE_URL="postgresql://user:password@localhost:5432/tournament_db?schema=public"

# Redis (BullMQ queues & caching - optional for local dev)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...

# Clerk Webhook Secret (Svix)
CLERK_WEBHOOK_SECRET=whsec_...

# Frontend URL for CORS (supports comma-separated origins)
FRONTEND_URL=https://tournament-frontend-eta.vercel.app,http://localhost:5173

# Swagger Documentation (true | false)
SWAGGER_ENABLED=true
```

---

## 🏁 Getting Started

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **PostgreSQL** (Local instance, or cloud provider like [Prisma Postgres](https://www.prisma.io/postgres), [Neon](https://neon.tech), or [Supabase](https://supabase.com))
- *(Optional)* **Redis** for BullMQ background queues

### 2. Installation
```bash
git clone <repository-url>
cd tournament-backend
npm install
```

### 3. Database Setup & Sync
Generate the Prisma Client and push the schema directly to your database:

```bash
# Push schema to the database (creates tables, relations, enums)
npm run db:push

# Generate Prisma Client
npm run db:generate
```

### 4. Seed Dummy Data
Populate the database with sample games (VALORANT, CS2, Rocket League, Apex Legends, Tekken 8, Dota 2), demo users, and realistic tournaments with brackets:

```bash
npm run db:seed
```

### 5. Start the Development Server
```bash
# Starts Fastify with nodemon hot-reloading
npm run dev
```

The API will be accessible at:
- **API Base URL**: `http://localhost:3001`
- **Health Check**: `http://localhost:3001/health`
- **Interactive Swagger Docs**: `http://localhost:3001/docs`

---

## 📡 API Reference

### Health & Docs
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/health` | Server uptime and health check | Public |
| `GET` | `/docs` | OpenAPI / Swagger interactive documentation UI | Public |

### 🏆 Tournaments (`/api/tournaments`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/tournaments` | List tournaments (supports filtering by game, status, format) | Public |
| `GET` | `/api/tournaments/:id` | Get tournament details, bracket, and participants | Public |
| `POST` | `/api/tournaments` | Create a new tournament | `ORGANIZER` / `ADMIN` |
| `PATCH` | `/api/tournaments/:id` | Update tournament settings or status | `ORGANIZER` / `ADMIN` |
| `POST` | `/api/tournaments/:id/start` | Start tournament & auto-generate brackets | `ORGANIZER` / `ADMIN` |
| `POST` | `/api/tournaments/:id/register` | Register solo participant for a tournament | `PLAYER` |
| `GET` | `/api/tournaments/:id/teams` | List registered teams for a team-based tournament | Public |
| `POST` | `/api/tournaments/:id/teams` | Register a team for a team-based tournament | `PLAYER` |

### ⚔️ Matches & Brackets (`/api/matches`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/matches/:id` | Get match details and games breakdown | Public |
| `PATCH` | `/api/matches/:id/score` | Report scores and declare match winner | `MODERATOR` / `ORGANIZER` |

### 🎮 Games (`/api/games`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/games` | List supported esports titles | Public |
| `POST` | `/api/games` | Add a new game title | `ADMIN` |

### 🛡️ Teams (`/api/teams`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/teams/:id` | Get team details and roster members | Public |
| `POST` | `/api/teams` | Create a team roster | `PLAYER` |
| `POST` | `/api/teams/:id/members`| Invite or add player to team roster | Team Captain |

### 👤 Users & Webhooks
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/users/me` | Current authenticated user profile | Bearer Token |
| `PATCH` | `/api/users/me` | Update personal profile details | Bearer Token |
| `POST` | `/api/webhooks/clerk` | Clerk webhook sync (user lifecycle) | Svix Signature |

---

## 📜 Available NPM Scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `nodemon --watch src --ext js src/server.js` | Run backend in development mode |
| `npm run start` | `node src/server.js` | Run backend in production mode |
| `npm run worker` | `node src/worker/index.js` | Run standalone BullMQ background worker |
| `npm run dev:worker` | `nodemon --watch src --ext js src/worker/index.js` | Run BullMQ worker with auto-reload |
| `npm run db:push` | `prisma db push` | Push schema changes directly to the database |
| `npm run db:migrate` | `prisma migrate dev` | Create and apply database migrations |
| `npm run db:seed` | `node prisma/seed.js` | Run the seed script |
| `npm run db:studio` | `prisma studio` | Open Prisma Studio GUI in browser |
| `npm run db:generate`| `prisma generate` | Generate Prisma Client types |
| `npm test` | `jest` | Run test suite |

---

## 🌐 Production & Deployment

### Vercel / Render / Railway Notes
1. **Build Step**:
   Set your build command to:
   ```bash
   npm run build # runs: prisma generate
   ```
2. **Database Migrations on Deploy**:
   Make sure you run `npm run db:push` or apply migrations to your production database URL before starting the server.
3. **CORS Configuration**:
   Ensure `FRONTEND_URL` in your production environment variables points to your deployed frontend domain (e.g. `https://tournament-frontend-eta.vercel.app`).
   The backend automatically accepts subdomains matching `*.vercel.app` to support preview branches.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
