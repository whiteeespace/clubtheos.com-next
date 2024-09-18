import { getLocale } from "next-intl/server";

import { getShippingPolicy } from "../action";
import styles from "../styles.module.scss";

export default async function ReturnsAndExchangesPage() {
  const locale = await getLocale();
  const { shippingPolicy } = await getShippingPolicy(locale.toUpperCase());

  return (
    <div
      className={styles["container"]}
      dangerouslySetInnerHTML={{
        __html: shippingPolicy ?? "",
      }}
    />
  );
}
