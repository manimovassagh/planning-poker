# Planning Poker

> Real-time estimation ceremonies with collaborative UX, Socket.IO events, and a typed API/SPA monorepo powered by Turborepo.

![pnpm](https://img.shields.io/badge/pnpm-9.15+-f69220?logo=pnpm&logoColor=white) ![turbo](https://img.shields.io/badge/turborepo-2.4-000?logo=turbo&logoColor=white) ![license](https://img.shields.io/badge/license-MIT-2ea44f)

Planning Poker is a full-stack workspace for running agile estimation sessions. It bundles an Express + Prisma API, a Vite/React front-end, and a `@planning-poker/shared` package that centralizes socket contracts and validation schemas so both sides stay in sync.

## About
Planning Poker re-creates the flow of real-world estimation ceremonies in a browser: product managers spin up secure rooms, invite the squad, and everyone casts votes simultaneously so bias stays low. The facilitator can replay rounds, lock in final estimates, and export analytics for retros without juggling spreadsheets or plugins. Under the hood, a shared TypeScript contract keeps the API, Socket.IO events, and rich React UI perfectly aligned, so the experience feels instant and trustworthy whether you are hosting sprint planning, backlog refinement, or discovery spikes.

## Highlights
- **Hidden votes & facilitation tools** – All votes stay private until the facilitator reveals the round, preventing anchoring bias.
- **Real-time collaboration** – Socket.IO propagates joins, vote submissions, and results instantly to connected participants.
- **Typed contracts** – Shared Zod schemas and TypeScript types are published from `packages/shared`, reducing drift between clients.
- **Analytics-ready** – The API exposes room summaries, completed stories, and user history endpoints for retro insights.
- **Turborepo DX** – A single `pnpm dev` fans out to each workspace, with build/lint pipelines cached by Turbo.

## Monorepo Layout
```
.
├── apps
│   ├── api         # Express + Prisma server with JWT auth & Socket.IO
│   └── web         # React 19, Vite, Tailwind UI for facilitators & voters
├── packages
│   └── shared      # Reusable types, Zod schemas, socket event enums
├── docker-compose.yml  # Postgres 16 for local development
├── pnpm-workspace.yaml # Workspace definition for pnpm
└── turbo.json          # Pipeline orchestration for builds/lint/test
```

## Tech Stack
| Area | Tools |
| --- | --- |
| Front-end | React 19, Vite 7, TypeScript, Tailwind CSS, Zustand, React Router, Lucide icons |
| Back-end | Express 4, Socket.IO 4, Prisma 6, PostgreSQL 16, Zod validation, JWT auth |
| Tooling | pnpm 9, Turborepo 2, ESLint 9, TSX for API dev server |

## Key Features
1. **Room lifecycle management**: create, update, join, and archive rooms with shareable invite codes.
2. **Story tracking**: add backlog items per room, capture multiple voting rounds, and persist final estimates.
3. **Facilitator controls**: start voting, trigger re-votes, finalize stories, and copy invite codes with a single click.
4. **Voting experience**: Fibonacci/modified decks via `CardDeck`, live participant status, and reveal animations.
5. **Analytics endpoints**: `/api/analytics/rooms/:id` consolidates stats such as rounds per story and completion rates.

> ⚙️ Continue below for environment setup, scripts, and contribution workflows.

## Getting Started
### Prerequisites
- Node.js 20+ (align with the TypeScript/ESLint toolchain)
- pnpm 9.15 or newer (`corepack enable pnpm` makes it available globally)
- Docker Desktop (for the bundled Postgres 16 service)

### Installation
1. Copy the sample environment file and tweak it as needed:
   ```bash
   cp .env.example .env
   ```
2. Install workspace dependencies once at the repo root:
   ```bash
   pnpm install
   ```
3. Launch Postgres locally:
   ```bash
   docker compose up -d postgres
   ```
4. Generate Prisma client + sync the schema:
   ```bash
   pnpm --filter @planning-poker/api db:generate
   pnpm --filter @planning-poker/api db:push
   ```
5. Start everything via Turborepo (one terminal):
   ```bash
   pnpm dev
   ```
   The API boots on `http://localhost:3001`, and Vite serves the web UI on `http://localhost:5173`.

> Tip: You can target a single workspace with `pnpm --filter <name> <script>` if you prefer running the API and front-end separately.

## Environment Variables

| Name | Location | Description |
| --- | --- | --- |
| `DATABASE_URL` | API | PostgreSQL connection string used by Prisma |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | API | Secrets for auth tokens and refresh tokens |
| `PORT` | API | Express listen port (defaults to `3001`) |
| `CORS_ORIGIN` | API | Allowed origin for both REST & Socket.IO requests |
| `VITE_API_URL` | Web | Base URL for REST calls (defaults to the API origin) |
| `VITE_WS_URL` | Web | Socket.IO endpoint (usually matches the API origin) |

All variables live in `.env` at the repo root; Vite picks up the `VITE_*` entries automatically, and the API reads the rest via `process.env`.

## Workspace Scripts

| Scope | Command | Description |
| --- | --- | --- |
| Root | `pnpm dev` | Runs `dev` in every package via Turborepo (API + Web) |
| Root | `pnpm build` | Builds all workspaces with caching and topological ordering |
| Root | `pnpm lint` | Executes lint tasks (TS checks via `tsc --noEmit` + ESLint) |
| Root | `pnpm test` | Placeholder for future automated tests; Turbo-ready |
| API | `pnpm --filter @planning-poker/api dev` | Starts the Express server with `tsx watch` |
| API | `pnpm --filter @planning-poker/api db:migrate` | Create & apply a Prisma migration in dev |
| Web | `pnpm --filter @planning-poker/web dev` | Boots the Vite dev server with React Refresh |
| Shared | `pnpm --filter @planning-poker/shared build` | Emits TypeScript types for consumers |

## Database & Analytics
- Prisma models live in `apps/api/prisma`. Updating models should be followed by `db:generate` (type-safe client) and a migration via `db:migrate`.
- `analyticsRouter` aggregates room statistics, completion rates, and user history. Pair it with BI tooling by hitting `/api/analytics/rooms/:roomId` or `/api/analytics/rooms/:roomId/stories`.
- Postgres data persists in the `pgdata` Docker volume; run `docker compose down -v` to wipe it when you need a clean slate.

## Architecture Notes
- **API (`apps/api`)**: Express middlewares enforce CORS, rate limiting, JWT auth, and request validation via shared Zod schemas. Socket.IO authenticates each connection and wires custom room/vote events.
- **Web (`apps/web`)**: React 19 + Vite + Tailwind UI. Zustand stores (`authStore`, `roomStore`) coordinate auth, participants, and vote state. Components under `components/room` own the facilitator + participant experience.
- **Shared package**: Exposes `SocketEvents`, DTO types, and validation schemas, keeping the Web + API conversations type-safe.
- **Deployment**: Use `pnpm build` to output production assets, then deploy `apps/api/dist` behind Node or a serverless adapter and serve the `apps/web/dist` static bundle from any CDN.

## Quality & Testing
- `pnpm lint` ensures both API and Web TypeScript contracts compile and adhere to ESLint rules.
- Add Vitest or Jest suites per workspace, then wire them into `turbo.json` so `pnpm test` becomes meaningful in CI.
- Consider smoke tests around sockets (e.g., Cypress or Playwright) to assert join/vote/reveal flows.

## Contributing
1. Create a feature branch.
2. Update or add documentation/types in `packages/shared` when socket payloads change.
3. Keep commits small and run `pnpm lint` before pushing.
4. Submit a PR that references any relevant Linear/Jira ticket and include reproduction steps for UI changes.

---

Questions or ideas? Create an issue, or open a discussion thread describing the ceremony pain point you want to solve.
