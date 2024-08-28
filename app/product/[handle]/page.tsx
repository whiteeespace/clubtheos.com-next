"use client";

import { ProductProvider, useQuery } from "@whiteeespace/core";
import { useParams } from "next/navigation";

import { GET_PRODUCT } from "@utils/queries/get-product";
import { GetProductQuery, GetProductQueryVariables } from "gql/graphql";

import { ProductView } from "./ProductView";

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();

  const [result] = useQuery<GetProductQuery, GetProductQueryVariables>({
    query: GET_PRODUCT,
    variables: { handle: handle! },
  });
  const product = result.data?.product;

  if (!product) {
    return <></>;
  }

  return (
    <ProductProvider data={product}>
      <ProductView />
    </ProductProvider>
  );
};

export default ProductPage;
