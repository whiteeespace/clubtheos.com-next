import {
  CountryCode,
  GetFreeShippingQuery,
  GetFreeShippingQueryVariables,
  LanguageCode,
} from "@/gql/graphql";
import { GET_FREE_SHIPPING } from "@/lib/queries/get-free-shipping";
import { shopifyQuery } from "@/lib/shopify";

export async function getFreeShipping(language: string, country?: string) {
  const result = await shopifyQuery<GetFreeShippingQuery, GetFreeShippingQueryVariables>(
    GET_FREE_SHIPPING,
    {
      language: language as LanguageCode,
      country: country as CountryCode,
    }
  );

  return {
    freeShipping: result.metaobject?.text?.value ?? "",
    show: result.metaobject?.show?.value === "true",
  };
}

