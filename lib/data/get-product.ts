import {
  CountryCode,
  GetProductQuery,
  GetProductQueryVariables,
  LanguageCode,
} from "@/gql/graphql";
import { shopifyQuery } from "@/lib/shopify";
import { GET_PRODUCT } from "@/lib/queries/get-product";

export async function getProduct(handle: string, language: string, country: string) {
  const result = await shopifyQuery<GetProductQuery, GetProductQueryVariables>(GET_PRODUCT, {
    handle,
    language: language as LanguageCode,
    country: country as CountryCode,
  });

  return {
    product: result.product,
  };
}

