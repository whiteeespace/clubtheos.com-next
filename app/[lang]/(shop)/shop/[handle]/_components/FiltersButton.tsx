"use client";

import classNames from "classnames";
import { useTranslations } from "next-intl";
import { parseAsBoolean, useQueryState } from "nuqs";
import React from "react";

import Button from "@theos/Button";

import styles from "../styles.module.scss";

const FiltersButton: React.FC = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useQueryState("filtersOpen", parseAsBoolean);
  const t = useTranslations("filters");

  return (
    <Button
      variant="secondary"
      className={classNames(styles["filter-text"], {
        [styles["filter-text--selected"]]: isFiltersOpen,
      })}
      onClick={() => setIsFiltersOpen(isFiltersOpen ? null : true)}
    >
      {isFiltersOpen ? t("hide") : t("show")}
    </Button>
  );
};

export default FiltersButton;
