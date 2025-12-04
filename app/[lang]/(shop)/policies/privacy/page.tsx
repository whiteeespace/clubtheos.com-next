import { getLocale } from "next-intl/server";

import { getPrivacyPolicy } from "@/lib/data";

import styles from "../styles.module.scss";

export default async function PrivacyPolicyPage() {
  const locale = await getLocale();
  const { privacyPolicy } = await getPrivacyPolicy(locale.toUpperCase());

  return (
    <div
      className={styles.container}
      dangerouslySetInnerHTML={{
        __html: privacyPolicy ?? "",
      }}
    />
  );
}
