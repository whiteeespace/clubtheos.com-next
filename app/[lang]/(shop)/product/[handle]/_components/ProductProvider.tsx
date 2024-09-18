"use client";

import { ProductProvider as CoreProductProvider } from "@whiteeespace/core";
import { ReactNode } from "react";
import { PartialDeep } from "type-fest";

import { Product } from "@/gql/graphql";

interface ProductProviderProps {
  data: PartialDeep<Product, { recurseIntoArrays: true }>;
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ data, children }) => {
  return <CoreProductProvider data={data}>{children}</CoreProductProvider>;
};
