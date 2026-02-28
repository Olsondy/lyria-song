# Structured Data (JSON-LD) Documentation

## Overview

Lyricsong implements JSON-LD structured data using [schema.org](https://schema.org/) vocabulary for SEO and Google rich results. Built with full TypeScript type safety using `schema-dts`.

## Architecture

### File Structure

```
src/lib/schema/
├── constants.ts           # Site-wide constants
├── utils.ts               # Helper utilities
├── builders/
│   ├── website.ts         # WebSite schema
│   ├── organization.ts    # Organization schema
│   ├── software-application.ts  # SoftwareApplication schema
│   ├── faq-page.ts        # FAQPage schema
│   ├── item-list.ts       # ItemList schema
│   ├── price-offer.ts     # Offer schema for pricing
│   ├── breadcrumb.ts      # BreadcrumbList schema
│   ├── collection-page.ts # CollectionPage schema
│   ├── resources.ts    # Resources schemas
│   └── web-page.ts        # WebPage schema
└── index.ts               # Barrel export
```

**Dependency:** `pnpm add schema-dts`

## Schema Types

| Schema | Builder | Pages |
|--------|---------|-------|
| WebSite | `buildWebSiteSchema(name, description, locale)` | Root layout (global) |
| WebPage | `WEB_PAGE_SCHEMAS.PRIVACY/TERMS/LICENSE/COMMERCIAL_LICENSE(...)` | Privacy, Terms, License, Commercial License |
| CollectionPage | `buildCollectionPageSchema(options)` | Creation Lab |
| Organization | `buildOrganizationSchema(name, description)` | Root layout (global) |
| SoftwareApplication | `SOFTWARE_APPLICATION_SCHEMAS.AI_MUSIC_MAKER(...)` | Homepage, Generator pages, tool pages |
| FAQPage | `buildFAQPageSchema(faqItems)` | Homepage, Generators, Pricing |
| ItemList | `ITEM_LIST_SCHEMAS.CORE_GENERATORS(locale, descriptions)` | Homepage |
| PriceOffer | `PRICE_OFFER_SCHEMAS.STARTER_MONTHLY(...)` | Pricing |
| Resources | `buildResourceDetailSchema(options)` | `/resources/[slug]` |
| BreadcrumbList | `BREADCRUMB_SCHEMAS.*` | All pages |


Resources uses two JSON-LD patterns:

1. **List page** (`/creation-lab/resources`)  
   Uses `buildResourcesCollectionPageSchema(...)` and emits:
   - `CollectionPage` as root
   - `mainEntity` as `ItemList`
   - each list item as `ListItem -> Article` with:
     - `headline` (from i18n key `CreationLab.resources.card.items.{slug}.title`, fallback to slug text)
     - `description` (from i18n key `CreationLab.resources.card.items.{slug}.description`, fallback empty string)
     - `url` (`/{locale}/creation-lab/resources/{slug}`)
     - `inLanguage`
     - `datePublished` / `dateModified` (from `published_date` / `updated_at`)
     - `image` (from `cover_url`, normalized to absolute URL)

2. **Detail page** (`/creation-lab/resources/[slug]`)  
   Uses `buildResourceDetailSchema(...)` and emits:
   - `Article` as root with:
     - `headline`, `description`, `url`, `inLanguage`
     - `datePublished`, `dateModified`, `image`
     - `mainEntityOfPage` (`WebPage`)
     - `author` and `publisher` as site organization
     - `isPartOf` referencing `#website`

**Data source:** `lab_resources` table metadata + markdown body under `src/content/lab/resources/{locale}/{slug}.md`.

## Component Usage

### JsonLd Component

```tsx
import { JsonLd } from "@/components/structured-data";

export default async function Page() {
  const schema = buildWebSiteSchema("LyriaSong", "Description", "en");
  return <JsonLd schema={schema} />;
}
```

### Server Component Pattern

```tsx
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/structured-data";
import { SOFTWARE_APPLICATION_SCHEMAS, faqFromTranslations, buildFAQPageSchema } from "@/lib/schema";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tSchema = await getTranslations("Schema");
  const tFAQ = await getTranslations("FAQ");

  const softwareAppSchema = SOFTWARE_APPLICATION_SCHEMAS.AI_SONG_GENERATOR(
    tSchema("aiSongGeneratorDescription"),
    locale
  );

  const faqItems = faqFromTranslations((key) => tFAQ(key), [{ q: "q1", a: "a1" }]);
  const faqSchema = buildFAQPageSchema(faqItems);

  return (
    <>
      <JsonLd schema={softwareAppSchema} />
      <JsonLd schema={faqSchema} />
    </>
  );
}
```

## Translations

Schema translations use the `Schema` namespace:

```json
{
  "Schema": {
    "home": "Home",
    "aiSongGeneratorDescription": "...",
    "starterMonthlyDescription": "...",
    ...
  }
}
```

## Validation Tools

1. [Google Rich Results Test](https://search.google.com/test/rich-results) - Test URLs for eligible rich results
2. [Schema Markup Validator](https://validator.schema.org/) - Validate JSON-LD syntax
3. Google Search Console - Monitor structured data errors

## Page Implementations

| Page | Schemas |
|------|---------|
| Root Layout | WebSite, Organization |
| Homepage | SoftwareApplication, ItemList, FAQPage |


## Best Practices

1. **Always use Server Components** - Schemas must be server-rendered for SEO
2. **Provide accurate data** - Titles, URLs, descriptions must match page content
3. **Handle missing data** - Use fallback values for optional fields
4. **Only output schema.org-valid properties** - Do not spread raw metadata objects into schema nodes
5. **Map custom fields explicitly** - Example: internal `display_style` -> `genre`, `display_title` -> `keywords`
6. **Use translation keys** - Use the matching namespace for each page (e.g. `Schema`, `CreationLab.resources`)
7. **Use `ListItem.item` for collection lists** - Prefer `ListItem -> item(WebPage/Article/...)` over placing only `name/url` directly on `ListItem`
8. **Include multiple schemas** - Use multiple `<JsonLd />` components when appropriate

## Tool Presets

- `SOFTWARE_APPLICATION_SCHEMAS.EXTEND_SONG(description, locale)` - Extend Song software schema preset
- `BREADCRUMB_SCHEMAS.EXTEND_SONG(locale, homeName, pageName)` - Extend Song breadcrumb preset
- `BREADCRUMB_SCHEMAS.COMMERCIAL_LICENSE(locale, homeName, pageName)` - Commercial License breadcrumb preset

## Related Files

- `src/lib/schema/` - Schema builders and utilities
- `src/components/structured-data/` - JSON-LD components
- `src/messages/*.json` - Schema translations

## Further Reading

- [schema.org](https://schema.org/) - Schema vocabulary
- [schema-dts](https://github.com/schemaorg/schemaorg) - TypeScript definitions
- [Google Search Central - Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
