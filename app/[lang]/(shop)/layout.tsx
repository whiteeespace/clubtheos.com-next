import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import { LanguageCode } from "@/gql/graphql";
import { ShopProvider } from "@/lib/context/shop-context";
import { getReleaseData } from "@/lib/data";
import { parseMetaobject, ValueMetaobject } from "@/lib/metaobjects";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import { baseUrl } from "@utils/base-url";

import styles from "./styles.module.scss";

export const metadata: Metadata = {
  title: "Club Theos",
  description: "A Montreal curated vintage/streetwear store located at the Plateau Mont-Royal.",
  metadataBase: new URL(baseUrl),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const data = await getReleaseData(locale.toUpperCase() as LanguageCode);
  if (!data) return <></>;

  const releaseOn = parseMetaobject<ValueMetaobject>({ value: data.releaseOn ?? undefined });
  const closeOn = parseMetaobject<ValueMetaobject>({ value: data.closeOn ?? undefined });

  const releaseDate = releaseOn?.value ? new Date(releaseOn.value) : null;
  const closeDate = closeOn?.value ? new Date(closeOn.value) : null;
  const now = new Date();

  const releaseCollectionHandle = data.collection?.handle ?? null;

  const cookieStore = await cookies();
  const cookiePassword = cookieStore.get("theos_early_access")?.value;
  const hasEarlyAccess = cookiePassword && data.password && cookiePassword === data.password;

  // Redirect to home if shop is not active (before release or after close)
  const isBeforeRelease = releaseDate && !isNaN(releaseDate.getTime()) && now <= releaseDate;
  const isAfterClose = closeDate && !isNaN(closeDate.getTime()) && now >= closeDate;
  if ((isBeforeRelease && !hasEarlyAccess) || isAfterClose || data.isSpecialCollection) {
    redirect(`/${locale}`);
  }

  return (
    <ShopProvider releaseCollectionHandle={releaseCollectionHandle}>
      <Navbar />
      <main className={styles.container}>{children}</main>
      <Footer />
    </ShopProvider>
  );
}
