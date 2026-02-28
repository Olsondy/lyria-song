# Authentication Architecture (Better Auth + Drizzle)

## Overview

`lyria-song` uses Better Auth for identity/session flows and stores auth data in PostgreSQL through Drizzle ORM.

This is the current replacement baseline for Supabase client auth coupling.

## Core Files

```
src/lib/auth/auth.ts               # Better Auth server instance
src/lib/auth/client.ts             # Better Auth client instance
src/lib/auth/session.ts            # Server-side session helper
src/app/api/auth/[...all]/route.ts # Next.js route handler binding
src/lib/db/schema.ts               # Auth + app database schema
src/lib/db/index.ts                # Drizzle DB accessor
```

## Data Model

Auth tables in `src/lib/db/schema.ts`:

- `user`
- `session`
- `account`
- `verification`

MVP app table currently using auth owner relation:

- `songs`

## Protected Route Pattern

Example: `src/app/user/my-songs/page.tsx`

1. Read session via `getServerSession()`
2. Redirect unauthenticated users to `/auth/login`
3. Query user-scoped records through Drizzle

## Login Flow

- Login UI route: `/auth/login`
- Better Auth handler: `/api/auth/[...all]`
- Supported methods in current UI:
  - Email + password
  - Social sign-in (Google/GitHub, when env vars are configured)

## Required Environment Variables

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_BETTER_AUTH_URL`
- Optional OAuth:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`

## Migration Note

Supabase-specific auth client usage is not part of this project baseline.
