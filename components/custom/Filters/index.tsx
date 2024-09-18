"use client";

import { Popover } from "@headlessui/react";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { PropsWithChildren, forwardRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "@theos/Button";
import Checkbox from "@theos/form-components/Checkbox";

import styles from "./styles.module.scss";

interface FilterOption {
  name: string;
  value: string;
}

interface FiltersProps {
  className?: string;
}

type Ref = HTMLFormElement;

export const Filters: React.FC<PropsWithChildren<FiltersProps>> = ({ children, className }) => (
  <motion.div className={classNames(styles["filters"], className)}>{children}</motion.div>
);

interface FormValues {
  filterValues: string[];
}

interface FilterProps {
  label: string;
  options: FilterOption[];
  defaultValues?: string[];
  count: number;
  onSubmit: (formData: FormValues) => void;
}

const Filter = forwardRef<Ref, FilterProps>(({ label, options, defaultValues, count, onSubmit }, ref) => {
  const t = useTranslations("filters");
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { filterValues: defaultValues ?? [] },
  });

  useEffect(() => {
    reset({ filterValues: defaultValues ?? [] });
  }, [defaultValues, reset]);

  return (
    <Popover as="div" className={styles["menu"]}>
      <form ref={ref}>
        <Popover.Button className={styles["menu-button"]}>
          {label}
          {!!count && <span className={styles["count"]}>{count}</span>}
        </Popover.Button>
        <AnimatePresence>
          <Popover.Panel>
            {({ close }) => (
              <motion.div
                key={"menu-items"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
                className={classNames(styles["menu-items"])}
              >
                <div className={styles["options"]}>
                  {options.map((option) => (
                    <Checkbox
                      key={option.name}
                      {...register("filterValues")}
                      label={option.name}
                      value={option.value}
                      className={styles["item"]}
                    />
                  ))}
                </div>
                <div className={styles["action"]}>
                  <Button
                    type={"button"}
                    className={styles["action-button"]}
                    onClick={() => {
                      handleSubmit(onSubmit)();
                      close();
                    }}
                  >
                    {t("apply")}
                  </Button>
                </div>
              </motion.div>
            )}
          </Popover.Panel>
        </AnimatePresence>
      </form>
    </Popover>
  );
});

Filter.displayName = "Filter";

interface VariantFilterProps {
  label: string;
  options: string[];
  type: "size" | "color";
}

export const VariantFilter = forwardRef<Ref, VariantFilterProps>(({ label, options, type }, ref) => {
  const filterName = type === "size" ? "size" : "color";
  const [variantFilter, setVariantFilter] = useQueryState(filterName, parseAsArrayOf(parseAsString));

  const onSubmit = useCallback(
    (formData: FormValues) => {
      const { filterValues } = formData;
      setVariantFilter(filterValues);
    },
    [setVariantFilter]
  );

  return (
    <Filter
      ref={ref}
      count={variantFilter?.length ?? 0}
      defaultValues={variantFilter ?? undefined}
      label={label}
      options={options.map((option) => ({ name: option, value: option }))}
      onSubmit={onSubmit}
    />
  );
});

VariantFilter.displayName = "VariantFilter";

interface ProductTypeFilterProps {
  label: string;
  options: string[];
}

export const ProductTypeFilter = forwardRef<Ref, ProductTypeFilterProps>(({ label, options }, ref) => {
  const [productTypeFilter, setProductTypeFilter] = useQueryState(
    "productType",
    parseAsArrayOf(parseAsString)
  );

  const onSubmit = useCallback(
    (formData: FormValues) => {
      const { filterValues } = formData;
      setProductTypeFilter(filterValues);
    },
    [setProductTypeFilter]
  );

  return (
    <Filter
      ref={ref}
      count={productTypeFilter?.length ?? 0}
      defaultValues={productTypeFilter ?? undefined}
      label={label}
      options={options.map((option) => ({ name: option, value: option }))}
      onSubmit={onSubmit}
    />
  );
});

ProductTypeFilter.displayName = "ProductTypeFilter";

interface AvailabilityFilterProps {
  label: string;
  options: FilterOption[];
}

export const AvailabilityFilter = forwardRef<Ref, AvailabilityFilterProps>(({ label, options }, ref) => {
  const [availabilityFilter, setAvailabilityFilter] = useQueryState(
    "availability",
    parseAsArrayOf(parseAsString)
  );

  const onSubmit = useCallback(
    (formData: FormValues) => {
      const { filterValues } = formData;
      const availabilityFilterValue = filterValues.map(() => "available");
      setAvailabilityFilter(availabilityFilterValue);
    },
    [setAvailabilityFilter]
  );

  return (
    <Filter
      ref={ref}
      count={availabilityFilter?.length ?? 0}
      defaultValues={availabilityFilter ?? undefined}
      label={label}
      options={options}
      onSubmit={onSubmit}
    />
  );
});

AvailabilityFilter.displayName = "AvailabilityFilter";
