import { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";

import { baseUrl } from "@/lib/base-url";
import Layout from "@components/Layout";

import "../global.scss";

export const metadata: Metadata = {
  title: "Club Theos",
  description: "A Montreal curated vintage/streetwear store located at the Plateau Mont-Royal.",
  metadataBase: new URL(baseUrl),
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  unstable_setRequestLocale(params.lang);
  const messages = await getMessages();

  return (
    <html lang={params.lang}>
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
