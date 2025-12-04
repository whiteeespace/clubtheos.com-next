import { useTranslations } from "next-intl";

import { Link } from "@utils/navigation";

import { Blob } from "./_components/Blob";
import styles from "./styles.module.scss";

const Footer: React.FC = () => {
  const t = useTranslations("navigation");
  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <h3 className={styles.copyright}>© {new Date().getFullYear()} Club Theos</h3>
        <div className={styles.links}>
          <Link href={"/policies/returns-and-exchanges"} className={styles.link}>
            {t("policies.returns_and_exchanges")}
          </Link>
          <Link href={"/policies/terms-and-conditions"} className={styles.link}>
            {t("policies.terms_and_conditions")}
          </Link>
          <Link href={"/policies/shipping"} className={styles.link}>
            {t("policies.shipping_policy")}
          </Link>
          <Link href={"/policies/privacy"} className={styles.link}>
            {t("policies.privacy_policy")}
          </Link>
        </div>
      </div>
      <Blob />
    </div>
  );
};

export default Footer;
