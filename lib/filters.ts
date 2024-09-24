import { PartialDeep } from "type-fest";

import { Filter, ProductFilter } from "@/gql/graphql";

export interface AvailabilityFilterType {
  available: boolean;
}

export interface ProductTypeFilterType {
  productType: string;
}

export interface VariantFilterType {
  variantOption: {
    name: string;
    value: string;
  };
}

export interface Filters {
  productTypeFilter: ProductTypeFilterType[];
  availabilityFilter: AvailabilityFilterType[];
  colorFilter: VariantFilterType[];
  sizeFilter: VariantFilterType[];
}

export const getFilters = (filters?: {
  productType?: string[] | null;
  size?: string[] | null;
  color?: string[] | null;
  availability?: string[] | null;
}): ProductFilter[] => {
  const filtersInput: Filters = {
    productTypeFilter: filters?.productType?.map((productType) => ({ productType })) ?? [],
    sizeFilter: filters?.size?.map((size) => ({ variantOption: { name: "size", value: size } })) ?? [],
    colorFilter: filters?.color?.map((color) => ({ variantOption: { name: "color", value: color } })) ?? [],
    availabilityFilter:
      filters?.availability?.map((availability) => ({ available: availability === "true" })) ?? [],
  };

  return [
    ...(filtersInput?.productTypeFilter || []),
    ...(filtersInput?.availabilityFilter || []),
    ...(filtersInput?.colorFilter || []),
    ...(filtersInput?.sizeFilter || []),
  ];
};

export const getSearchParamsFilters = (filters?: string | string[]) => {
  if (!filters) return undefined;
  return Array.isArray(filters) ? filters : [filters];
};

export const getProductCount = (filters?: PartialDeep<Filter, { recurseIntoArrays: true }>[]) => {
  const availabilityFilter = filters?.find((filter) => filter.id === "filter.v.availability");
  const totalProductCount = availabilityFilter?.values?.reduce(
    (acc, filter) => acc + (filter?.count ?? 0),
    0
  );
  return totalProductCount ?? 0;
};
