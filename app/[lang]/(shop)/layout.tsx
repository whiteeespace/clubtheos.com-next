import { Metadata } from "next";

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
  return (
    <>
      <Navbar />
      <main className={styles["container"]}>{children}</main>
      <Footer />
    </>
  );
}
