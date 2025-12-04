"use client";

import { useTranslations } from "next-intl";
import { parseAsBoolean, parseAsString, useQueryState, useQueryStates } from "nuqs";
import { PartialDeep } from "type-fest";

import { Filter } from "@/gql/graphql";
import { AvailabilityFilter, Filters, ProductTypeFilter, VariantFilter } from "@components/Filters";
import Button from "@theos/Button";

import styles from "../styles.module.scss";

interface ShopFiltersProps {
  filters: {
    productType?: PartialDeep<Filter, { recurseIntoArrays: true }>;
    size?: PartialDeep<Filter, { recurseIntoArrays: true }>;
    color?: PartialDeep<Filter, { recurseIntoArrays: true }>;
  };
}

export const ShopFilters: React.FC<ShopFiltersProps> = ({ filters }) => {
  const t = useTranslations("filters");
  const [isFiltersOpen] = useQueryState("filtersOpen", parseAsBoolean);

  const [, setFilters] = useQueryStates(
    {
      productType: parseAsString,
      size: parseAsString,
      color: parseAsString,
      availability: parseAsString,
    },
    { history: "push" }
  );

  const resetFilters = () => {
    void setFilters(null);
  };

  if (!isFiltersOpen) {
    return null;
  }

  return (
    <div className={styles["filters-container"]}>
      <Filters className={styles.filters}>
        <ProductTypeFilter
          label={t("types.type")}
          options={filters.productType?.values?.map((value) => value?.label ?? "") ?? []}
        />
        <VariantFilter
          label={t("types.size")}
          type={"size"}
          options={filters.size?.values?.map((value) => value?.label ?? "") ?? []}
        />
        <VariantFilter
          label={t("types.color")}
          type={"color"}
          options={filters.color?.values?.map((value) => value?.label ?? "") ?? []}
        />
        <AvailabilityFilter
          label={t("types.availability")}
          options={[{ name: t("hide_sold_out"), value: "available" }]}
        />
      </Filters>
      <Button variant="secondary" className={styles["filter-text"]} onClick={() => resetFilters()}>
        {t("clear")}
      </Button>
    </div>
  );
};
