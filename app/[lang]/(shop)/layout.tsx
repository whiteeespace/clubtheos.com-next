import { Metadata } from "next";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

import { LanguageCode } from "@/gql/graphql";
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

  const releaseDate = releaseOn?.value ? new Date(releaseOn.value) : null;
  const cookieStore = await cookies();
  const cookiePassword = cookieStore.get("theos_early_access")?.value;
  const hasEarlyAccess = cookiePassword && data.password && cookiePassword === data.password;
  if (releaseDate && !isNaN(releaseDate.getTime()) && new Date() <= releaseDate && !hasEarlyAccess) {
    redirect(`/${locale}`);
  }

  return (
    <>
      <Navbar />
      <main className={styles["container"]}>{children}</main>
      <Footer />
    </>
  );
}
