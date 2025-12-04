import { getLocale } from "next-intl/server";

import { getRefundPolicy } from "@/lib/data";

import styles from "../styles.module.scss";

export default async function ReturnsAndExchangesPage() {
  const locale = await getLocale();
  const { refundPolicy } = await getRefundPolicy(locale.toUpperCase());

  return (
    <div
      className={styles["container"]}
      dangerouslySetInnerHTML={{
        __html: refundPolicy ?? "",
      }}
    />
  );
}
