"use client";

import { useEffect } from "react";
import { PartialDeep } from "type-fest";

import { Filter } from "@/gql/graphql";
import { useShopContext } from "@components/Layout/ShopContext";

import { Products } from "./Products";
import { ShopFilters } from "./ShopFilters";

interface ShopContentProps {
  collectionHandle: string;
  filters: {
    productType?: PartialDeep<Filter, { recurseIntoArrays: true }>;
    size?: PartialDeep<Filter, { recurseIntoArrays: true }>;
    color?: PartialDeep<Filter, { recurseIntoArrays: true }>;
  };
}

export const ShopContent: React.FC<ShopContentProps> = ({ collectionHandle, filters }) => {
  const { setCurrentCollection } = useShopContext();

  // Set currentCollection in context for consistency with other components that might read it
  useEffect(() => {
    setCurrentCollection(collectionHandle);
  }, [collectionHandle, setCurrentCollection]);

  return (
    <>
      <ShopFilters filters={filters} />
      <Products collectionHandle={collectionHandle} />
    </>
  );
};
