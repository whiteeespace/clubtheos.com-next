import { ProductFilter } from "@/gql/graphql";

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
  productType: string[] | null;
  size: string[] | null;
  color: string[] | null;
  availability: string[] | null;
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
