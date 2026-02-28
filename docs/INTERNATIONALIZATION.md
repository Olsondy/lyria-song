# Internationalization (i18n) Architecture

## Overview

LyriaSong uses `next-intl` for locale routing and message loading.

- Default locale: `en`
- Supported locales: `en`, `ja`, `fr`, `de`, `es`
- Locale routing mode: `localePrefix: "as-needed"`

## Core Files

```
src/i18n/
├── routing.ts          # locales / defaultLocale / localePrefix
├── request.ts          # load locale messages from src/messages
└── navigation.ts       # locale-aware Link/useRouter/usePathname helpers

src/messages/
├── en.json
├── ja.json
├── fr.json
├── de.json
└── es.json

src/types/
└── i18n.d.ts           # next-intl AppConfig typing (Locale + Messages)

src/proxy.ts            # next-intl proxy entry for locale detection/routing
```

## URL Routing Strategy

English (default) has no prefix:

- `/`
- `/create`
- `/pricing`

Other locales use a prefix:

- `/ja`
- `/ja/create`
- `/ja/pricing`

Routing source of truth: `src/i18n/routing.ts`.

## App Router `[locale]` Structure

Page routes are organized under `src/app/[locale]/` and API routes remain outside locale segment:

```
src/app/
├── [locale]/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── create/
│   │   └── page.tsx
│   ├── pricing/
│   │   └── page.tsx
│   ├── resources/
│   │   └── page.tsx
│   ├── user/
│   │   └── my-songs/
│   │       └── page.tsx
│   └── auth/
│       └── login/
│           └── page.tsx
└── api/
    └── auth/
        └── [...all]/route.ts
```

### `[locale]/layout.tsx` Baseline

Current locale layout does:

1. Read `params.locale`
2. Validate locale against `routing.locales`
3. Call `setRequestLocale(locale)`
4. Load messages and wrap `NextIntlClientProvider`

## Translation Namespaces (Current)

Top-level namespaces in `src/messages/*.json`:

- `Metadata`
- `Navigation`
- `Auth`
- `HomePage`
- `CreatePage`
- `PricingPage`
- `ResourcesPage`
- `MySongsPage`
- `Common`
- `Footer`
- `Errors`

All locale files must keep the same namespace structure.

## Type Safety (`src/types/i18n.d.ts`)

Use `next-intl` module augmentation to type locale and messages:

- `Locale`: inferred from `routing.locales`
- `Messages`: inferred from `src/messages/en.json`

This enables autocomplete and compile-time key checking for translations.

## Proxy Configuration (`src/proxy.ts`)

`src/proxy.ts` is the i18n proxy entry (Next.js 16). It should:

- Apply `next-intl` locale routing using `routing`
- Exclude API and static assets via matcher
- Keep Better Auth route handlers (`/api/auth/[...all]`) untouched

## Component Patterns

### Server Components (Better Auth + i18n)

```typescript
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";

export default async function MySongsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("MySongsPage");

  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  return <h1>{t("title")}</h1>;
}
```

### Client Components

```typescript
"use client";
import { useTranslations } from "next-intl";

export function PricingCta() {
  const t = useTranslations("PricingPage");
  return <button>{t("title")}</button>;
}
```

### Locale-aware Navigation

```typescript
import { Link } from "@/i18n/navigation";

<Link href="/pricing">Pricing</Link>;
```

## Related Files

- `src/i18n/routing.ts`
- `src/i18n/request.ts`
- `src/i18n/navigation.ts`
- `src/app/[locale]/layout.tsx`
- `src/types/i18n.d.ts`
- `src/proxy.ts`
- `src/messages/en.json`
