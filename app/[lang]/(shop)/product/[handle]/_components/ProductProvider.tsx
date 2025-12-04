"use client";

import { ProductProvider as HydrogenProductProvider } from "@shopify/hydrogen-react";
import { ReactNode } from "react";
import { PartialDeep } from "type-fest";

import { Product } from "@/gql/graphql";

interface ProductProviderProps {
  data: PartialDeep<Product, { recurseIntoArrays: true }>;
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ data, children }) => {
  return <HydrogenProductProvider data={data}>{children}</HydrogenProductProvider>;
};
