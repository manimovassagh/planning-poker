# Planning Poker

> Real-time estimation ceremonies with collaborative UX, Socket.IO events, and a typed API/SPA monorepo powered by Turborepo.

![pnpm](https://img.shields.io/badge/pnpm-9.15+-f69220?logo=pnpm&logoColor=white) ![turbo](https://img.shields.io/badge/turborepo-2.4-000?logo=turbo&logoColor=white) ![license](https://img.shields.io/badge/license-MIT-2ea44f)

Planning Poker is a full-stack workspace for running agile estimation sessions. It bundles an Express + Prisma API, a Vite/React front-end, and a `@planning-poker/shared` package that centralizes socket contracts and validation schemas so both sides stay in sync.

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
