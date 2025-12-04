import { ProductVariant } from "@/gql/graphql";

export type ProductVariantWithSizeChart = ProductVariant & {
  sizeChart?: {
    type: string;
    value: string;
  };
};

export interface VariantSizeChart {
  size: string;
  measurements: {
    value: number;
    unit: string;
  }[];
}

export const getVariantsSizeChart = (variants: ProductVariantWithSizeChart[]): VariantSizeChart[] => {
  return variants.map((variant: ProductVariantWithSizeChart) =>
    variant?.sizeChart?.value
      ? {
          size: variant?.title,
          measurements: JSON.parse(variant?.sizeChart?.value) as VariantSizeChart["measurements"],
        }
      : {
          size: variant?.title,
          measurements: [],
        }
  );
};
