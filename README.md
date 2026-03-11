# Fotosnap

A full-stack photo-sharing social platform built with NestJS and Next.js in a Turborepo monorepo.

## Features

- **Authentication** — email/password sign-up and login via [Better Auth](https://better-auth.com)
- **Posts** — create photo posts with captions, like and save posts
- **Stories** — ephemeral photo stories with automatic expiry
- **Comments** — comment on posts
- **Image uploads** — server-side file handling via Multer
- **Type-safe API** — end-to-end type safety with [tRPC](https://trpc.io)

## Tech Stack

| Layer    | Technology                                                                           |
| -------- | ------------------------------------------------------------------------------------ |
| Backend  | [NestJS](https://nestjs.com) 11, [Drizzle ORM](https://orm.drizzle.team), PostgreSQL |
| Frontend | [Next.js](https://nextjs.org) 16, React 19, Tailwind CSS v4, shadcn/ui               |
| API      | [tRPC](https://trpc.io) v11, [React Query](https://tanstack.com/query)               |
| Auth     | [Better Auth](https://better-auth.com) v1                                            |
| Monorepo | [Turborepo](https://turborepo.dev), pnpm workspaces                                  |

## Monorepo Structure

```
fotosnap/
├── apps/
│   ├── backend/        # NestJS API (port 3001)
│   └── web/            # Next.js app (port 3000)
└── packages/
    ├── trpc/           # Shared tRPC router types & schemas
    ├── eslint-config/  # Shared ESLint configurations
    └── typescript-config/ # Shared tsconfig.json files
```

## Prerequisites

- [Node.js](https://nodejs.org) >= 18
- [pnpm](https://pnpm.io) >= 10
- [Docker](https://www.docker.com) (for PostgreSQL)

## Getting Started

### 1. Install dependencies

```sh
pnpm install
```

### 2. Start the database

```sh
docker compose up -d
```

### 3. Configure environment variables

Create `apps/backend/.env`:

```env
DATABASE_URL=postgresql://fotosnap:fotosnap@localhost:5432/fotosnap
UI_URL=http://localhost:3000
```

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Run database migrations

```sh
cd apps/backend
npx drizzle-kit migrate
```

### 5. Start the development servers

```sh
# From the repo root — starts both backend and frontend
pnpm dev
```

The backend will be available at `http://localhost:3001` and the frontend at `http://localhost:3000`.

## Available Scripts

Run these from the repo root:

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `pnpm dev`         | Start all apps in watch mode   |
| `pnpm build`       | Build all apps and packages    |
| `pnpm lint`        | Lint all packages              |
| `pnpm format`      | Format all files with Prettier |
| `pnpm check-types` | Type-check all packages        |

To target a specific app, use a [Turbo filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```sh
pnpm dev --filter=web
pnpm dev --filter=backend
```

## Database Migrations

Drizzle Kit is used to manage migrations from the `apps/backend` directory:

```sh
cd apps/backend

# Generate a new migration
npx drizzle-kit generate

# Apply pending migrations
npx drizzle-kit migrate

# Open Drizzle Studio (database browser)
npx drizzle-kit studio
```

## Running Tests

```sh
# Unit tests
cd apps/backend && pnpm test

# E2E tests
cd apps/backend && pnpm test:e2e

# Coverage report
cd apps/backend && pnpm test:cov
```
