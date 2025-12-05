import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

import { Locale, locales, defaultLocale } from "./types";

interface MessageModule {
  default: Record<string, unknown>;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  if (!locales.includes(locale as Locale)) notFound();

  const [filters, metadata, navigation] = await Promise.all([
    import(`@/dictionaries/${locale}/filters.json`) as Promise<MessageModule>,
    import(`@/dictionaries/${locale}/metadata.json`) as Promise<MessageModule>,
    import(`@/dictionaries/${locale}/navigation.json`) as Promise<MessageModule>,
  ]);

  return {
    messages: {
      ...filters.default,
      ...metadata.default,
      ...navigation.default,
    },
    locale: locale ?? defaultLocale,
  };
});
