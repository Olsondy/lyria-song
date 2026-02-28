# LyriaSong

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Better Auth
- Drizzle ORM + PostgreSQL (`postgres` driver)
- Biome (lint + format)

## Quick Start

```bash
pnpm install
cp .env.example .env.local
pnpm db:push
pnpm dev
```

Open `http://localhost:3000`.

## Environment Variables

See `.env.example`:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_BETTER_AUTH_URL`
- OAuth credentials (`GOOGLE_*`, `GITHUB_*`) when needed

## Drizzle Commands

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:push
pnpm db:studio
```
