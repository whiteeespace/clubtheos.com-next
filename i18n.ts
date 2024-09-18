import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "fr"];
export const defaultLocale = "en";

export default getRequestConfig(async ({ locale }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: {
      ...(await import(`@/dictionaries/${locale}/filters.json`)).default,
      ...(await import(`@/dictionaries/${locale}/metadata.json`)).default,
      ...(await import(`@/dictionaries/${locale}/navigation.json`)).default,
    },
  };
});
