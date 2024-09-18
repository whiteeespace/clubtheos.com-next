"use server";

import { getClient } from "@whiteeespace/core/utils";

import { GetFreeShippingQuery, GetFreeShippingQueryVariables, LanguageCode } from "@/gql/graphql";
import { GET_FREE_SHIPPING } from "@utils/queries/get-free-shipping";

export const getFreeShipping = async (language: string) => {
  const client = getClient();

  const result = await client.query<GetFreeShippingQuery, GetFreeShippingQueryVariables>(GET_FREE_SHIPPING, {
    language: language as LanguageCode,
  });

  return {
    freeShipping: result.data?.metaobject?.text?.value ?? "",
  };
};
