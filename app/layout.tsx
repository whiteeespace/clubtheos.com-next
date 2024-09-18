import { Metadata } from "next";
import { ReactNode } from "react";

import { locales } from "@/i18n";
import { baseUrl } from "@/lib/base-url";

import "./global.scss";

type Props = {
  children: ReactNode;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export const metadata: Metadata = {
  title: "Club Theos",
  description: "A Montreal curated vintage/streetwear store located at the Plateau Mont-Royal.",
  metadataBase: new URL(baseUrl),
};
// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return children;
}
