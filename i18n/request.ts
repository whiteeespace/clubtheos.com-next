import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

import { Locale, locales, defaultLocale } from "./types";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: {
      ...(await import(`@/dictionaries/${locale}/filters.json`)).default,
      ...(await import(`@/dictionaries/${locale}/metadata.json`)).default,
      ...(await import(`@/dictionaries/${locale}/navigation.json`)).default,
    },
    locale: locale ?? defaultLocale,
  };
});
