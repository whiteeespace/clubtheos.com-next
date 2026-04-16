// Next.js 16+: `proxy.ts` (formerly `middleware.ts`). Must use the same routing config as `lib/navigation.ts`.

import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|static|trpc|_next|_vercel|.*\\..*).*)"],
};
