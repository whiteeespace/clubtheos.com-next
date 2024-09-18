"use server";

import { getClient } from "@whiteeespace/core/utils";

import {
  CountryCode,
  GetFreeShippingQuery,
  GetFreeShippingQueryVariables,
  GetProductQuery,
  GetProductQueryVariables,
  LanguageCode,
} from "@/gql/graphql";
import { GET_FREE_SHIPPING } from "@utils/queries/get-free-shipping";
import { GET_PRODUCT } from "@utils/queries/get-product";

export const getProduct = async (handle: string, language: string, country: string) => {
  const client = getClient();

  const result = await client.query<GetProductQuery, GetProductQueryVariables>(GET_PRODUCT, {
    handle,
    language: language as LanguageCode,
    country: country as CountryCode,
  });

  return {
    product: result.data?.product,
  };
};

export const getFreeShipping = async (language: string, country: string) => {
  const client = getClient();

  const result = await client.query<GetFreeShippingQuery, GetFreeShippingQueryVariables>(GET_FREE_SHIPPING, {
    language: language as LanguageCode,
    country: country as CountryCode,
  });

  return {
    freeShipping: result.data?.metaobject?.text?.value ?? "",
  };
};
