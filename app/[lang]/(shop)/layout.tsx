import { parseMetaobject, ValueMetaobject } from "@whiteeespace/core/utils";
import { Metadata } from "next";
import { cookies } from "next/headers";

import { LanguageCode } from "@/gql/graphql";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import { baseUrl } from "@utils/base-url";
import { redirect } from "@utils/navigation";

import { getReleaseDataCached } from "./action";
import styles from "./styles.module.scss";

export const metadata: Metadata = {
  title: "Club Theos",
  description: "A Montreal curated vintage/streetwear store located at the Plateau Mont-Royal.",
  metadataBase: new URL(baseUrl),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const data = await getReleaseDataCached("EN" as LanguageCode);
  if (!data) return <></>;

  const releaseOn = parseMetaobject<ValueMetaobject>({ value: data.releaseOn ?? undefined });

  const releaseDate = releaseOn?.value ? new Date(releaseOn.value) : null;
  const cookiePassword = cookies().get("theos_early_access")?.value;
  const hasEarlyAccess = cookiePassword && data.password && cookiePassword === data.password;
  if (releaseDate && !isNaN(releaseDate.getTime()) && new Date() <= releaseDate && !hasEarlyAccess) {
    redirect(`/`);
  }

  return (
    <>
      <Navbar />
      <main className={styles["container"]}>{children}</main>
      <Footer />
    </>
  );
}
