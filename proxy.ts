// middleware.ts

import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "@/i18n/types";

const middleware = createMiddleware({
  // A list of all locales that are supported
  locales,
  // Used when no locale matches
  defaultLocale,
});

export default middleware;

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
