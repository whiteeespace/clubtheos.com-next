"use client";

import { useTranslations } from "next-intl";

import Button from "@theos/Button";

import styles from "../styles.module.scss";

export const EarlyAccessButton = () => {
  const t = useTranslations("metadata.home");

  return (
    <Button variant="link" className={styles["button"]}>
      {t("get_early_access")}
    </Button>
  );
};
