import { getLocale } from "next-intl/server";

import { getShippingPolicy } from "@/lib/data";

import styles from "../styles.module.scss";

export default async function ShippingPolicyPage() {
  const locale = await getLocale();
  const { shippingPolicy } = await getShippingPolicy(locale.toUpperCase());

  return (
    <div
      className={styles.container}
      dangerouslySetInnerHTML={{
        __html: shippingPolicy ?? "",
      }}
    />
  );
}
