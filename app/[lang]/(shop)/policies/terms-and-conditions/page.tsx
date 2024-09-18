import { getLocale } from "next-intl/server";

import { getTermsAndConditionsPolicy } from "../action";
import styles from "../styles.module.scss";

export default async function ReturnsAndExchangesPage() {
  const locale = await getLocale();
  const { termsOfService } = await getTermsAndConditionsPolicy(locale.toUpperCase());

  return (
    <div
      className={styles["container"]}
      dangerouslySetInnerHTML={{
        __html: termsOfService ?? "",
      }}
    />
  );
}
