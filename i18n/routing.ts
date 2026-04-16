import { defineRouting } from "next-intl/routing";

import { defaultLocale, locales } from "./types";

/** Shared by `proxy.ts` (next-intl middleware) and `lib/navigation.ts` (Link, redirect, router). */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
