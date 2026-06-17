import { Metadata, Viewport } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { locales } from "@/i18n/types";
import { baseUrl } from "@/lib/base-url";
import Layout from "@components/Layout";

import "../global.scss";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Club Theos",
  description: "A Montreal curated vintage/streetwear store located at the Plateau Mont-Royal.",
  metadataBase: new URL(baseUrl),
};

// Force a light color scheme so the site stays white-background even when the
// user's OS/browser is set to dark mode.
export const viewport: Viewport = {
  colorScheme: "light",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  setRequestLocale(lang);
  const messages = await getMessages();

  return (
    <html lang={lang}>
      <NextIntlClientProvider messages={messages}>
        <body>
          <Layout>{children}</Layout>
          <Script
            async
            type="text/javascript"
            src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=RwmzgQ"
          />
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
