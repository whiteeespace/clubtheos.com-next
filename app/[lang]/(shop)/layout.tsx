import { getClient, parseMetaobject, ValueMetaobject } from "@whiteeespace/core/utils";
import { Metadata } from "next";

import { LanguageCode } from "@/gql/graphql";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import { baseUrl } from "@utils/base-url";
import { redirect } from "@utils/navigation";
import { GET_RELEASE_DATA } from "@utils/queries/get-release-data";

import styles from "./styles.module.scss";

export const metadata: Metadata = {
  title: "Club Theos",
  description: "A Montreal curated vintage/streetwear store located at the Plateau Mont-Royal.",
  metadataBase: new URL(baseUrl),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const result = await getClient().query(GET_RELEASE_DATA, { language: "EN" as LanguageCode });
  const releaseObject = result.data?.metaobjects.nodes[0];
  if (!releaseObject) return <></>;

  const releaseOn = parseMetaobject<ValueMetaobject>(releaseObject.releaseOn);

  const releaseDate = releaseOn?.value ? new Date(releaseOn.value) : null;
  if (releaseDate && !isNaN(releaseDate.getTime()) && new Date() <= releaseDate) redirect(`/`);

  return (
    <>
      <Navbar />
      <main className={styles["container"]}>{children}</main>
      <Footer />
    </>
  );
}
