import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ja", "fr", "de", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed", // en 无前缀，其他语言带前缀
});

export type Locale = (typeof routing.locales)[number];
