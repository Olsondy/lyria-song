## Project Overview

LyriaSong  is a Next.js 16 project that uses the App Router architecture with modern React features. 

- All implementation changes must happen in this project.
- Current baseline stack is `Better Auth + Drizzle ORM + PostgreSQL`.

## Key Technologies & Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Auth**: Better Auth
- **Database**: Drizzle ORM + `postgres` driver
- **UI Components**: shadcn/ui (Radix UI)
- **Animation**: Framer Motion v12
- **Tooling**: Biome (format + lint)

## Development Commands

- `pnpm dev` - Start development server on `http://localhost:3000`
- `pnpm build` - Production build
- `pnpm start` - Run production server
- `pnpm lint` - Run Biome checks
- `pnpm format` - Run Biome formatter
- `pnpm db:generate` - Generate Drizzle migration files
- `pnpm db:migrate` - Run migrations
- `pnpm db:push` - Push schema to DB
- `pnpm db:studio` - Open Drizzle Studio

## Code Standards

### Documentation Updates

**CRITICAL**: Always update related documentation files after making code changes:

- After auth changes → Update [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md)
- After i18n changes → Update [docs/INTERNATIONALIZATION.md](docs/INTERNATIONALIZATION.md)
- After music player changes → Update [docs/MUSIC_PLAYER.md](docs/MUSIC_PLAYER.md)
- After lyrics generation changes → Update [docs/LYRICS_GENERATION.md](docs/LYRICS_GENERATION.md)
- After payment/subscription changes → Update [docs/STRIPE_INTEGRATION.md](docs/STRIPE_INTEGRATION.md)
- After UI component changes → Update [docs/UI_DESIGN.md](docs/UI_DESIGN.md)
- After API route changes → Update [docs/BACKEND_API.md](docs/BACKEND_API.md)
- After structured data/JSON-LD changes → Update [docs/STRUCTURED_DATA.md](docs/STRUCTURED_DATA.md)
- App bootstrap/commands changes → Update [README](README)

Documentation must match current implementation, not intended future behavior.

### Formatting & Linting

- Use Biome formatting (2-space indentation)
- Keep imports organized
- Run `pnpm format` and `pnpm lint` before claiming completion

### UI Component Pattern
- Uses shadcn/ui components built on Radix UI
- Components follow class-variance-authority pattern
- Tailwind for styling with custom animations
- Consistent design system with tailwind-merge utility

### Adding New Components
**IMPORTANT**: NEVER manually add components to `src/components/ui`.

1. Use the shadcn MCP tools to find and add components:
   - `search_items_in_registries`: Search for components
   - `get_add_command_for_items`: Get the installation command
2. Or use the CLI directly: `npx shadcn add [component-name]`
3. This ensures all dependencies and variants are correctly configured.

## Project Structure (Current)

```
src/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── create/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── resources/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── user/my-songs/page.tsx
│   │   └── auth/login/page.tsx
│   └── api/auth/[...all]/route.ts
├── components/
│   └── login-form.tsx
├── i18n/
│   ├── routing.ts
│   ├── request.ts
│   └── navigation.ts
├── messages/
│   ├── en.json
│   ├── ja.json
│   ├── fr.json
│   ├── de.json
│   └── es.json
├── proxy.ts
├── types/
│   └── i18n.d.ts
└── lib/
    ├── auth/
    │   ├── auth.ts
    │   ├── client.ts
    │   └── session.ts
    └── db/
        ├── index.ts
        └── schema.ts
```

## Domain-Specific Documentation

The project has detailed documentation for each domain. **ALWAYS read the relevant documentation files before working on related features.**

### ALWAYS Read These Files Before:

- **[docs/AUTHENTICATION.md](docs/AUTHENTICATION.md)**
  - When working with auth flows, protected routes, user sessions
  - Covers: Better Auth flow, OAuth callback, server session pattern, protected route redirects

- **[docs/INTERNATIONALIZATION.md](docs/INTERNATIONALIZATION.md)**
  - When modifying pages, adding translations, changing routes
  - Covers: next-intl setup, URL routing, component patterns, language switcher

### Read When Relevant:

- **[docs/MUSIC_PLAYER.md](docs/MUSIC_PLAYER.md)**
  - When working with music playback functionality
  - Covers: Global player architecture, context provider, state management, track interface

- **[docs/LYRICS_GENERATION.md](docs/LYRICS_GENERATION.md)**
  - When working with lyrics generation features
  - Covers: API integration, useLyricsGenerator hook, modal integration

- **[docs/STRIPE_INTEGRATION.md](docs/STRIPE_INTEGRATION.md)**
  - When working with payments, subscriptions
  - Covers: Subscription flow, webhook handling, database schema

- **[docs/UI_DESIGN.md](docs/UI_DESIGN.md)**
  - When creating/modifying UI components
  - Covers: Design system, color palette, typography, styling conventions

- **[docs/BACKEND_API.md](docs/BACKEND_API.md)**
  - When creating API routes or working with backend logic
  - Covers: API route structure, logging patterns, error handling, external API integration

- **[docs/STRUCTURED_DATA.md](docs/STRUCTURED_DATA.md)**
  - When adding or modifying JSON-LD structured data for SEO
  - Covers: Schema builders, JsonLd component, schema types (WebSite, Organization, SoftwareApplication, FAQPage, MusicRecording, BreadcrumbList), translations, validation tools

## Quick Reference

### Server Session Check

```ts
import { getServerSession } from "@/lib/auth/session";

const session = await getServerSession();
if (!session?.user?.id) {
  // redirect
}
```

### Drizzle DB Access

```ts
import { getDb } from "@/lib/db";

const db = getDb();
```

### Better Auth Route

```ts
// src/app/api/auth/[...all]/route.ts
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/auth";

export const { GET, POST } = toNextJsHandler(auth);
```
