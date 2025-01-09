import { ProductVariant } from "@/gql/graphql";

export type ProductVariantWithSizeChart = ProductVariant & {
  sizeChart?: {
    type: string;
    value: string;
  };
};

export type VariantSizeChart = {
  value: number;
  unit: string;
  size: string;
}[];

export const getVariantsSizeChart = (variants: ProductVariantWithSizeChart[]): VariantSizeChart[] => {
  return variants.map(
    (variant: ProductVariantWithSizeChart) =>
      variant?.sizeChart?.value && {
        size: variant?.title,
        ...JSON.parse(variant?.sizeChart?.value),
      }
  );
};
