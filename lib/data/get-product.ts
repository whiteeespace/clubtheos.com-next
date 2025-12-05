import {
  CountryCode,
  GetProductQuery,
  GetProductQueryVariables,
  LanguageCode,
} from "@/gql/graphql";
import { GET_PRODUCT } from "@/lib/queries/get-product";
import { shopifyQuery } from "@/lib/shopify";

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

