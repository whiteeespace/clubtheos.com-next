import { flattenConnection } from "@shopify/hydrogen-react";

import {
  CountryCode,
  GetSearchResultsQuery,
  GetSearchResultsQueryVariables,
  LanguageCode,
  Product,
} from "@/gql/graphql";
import { shopifyQuery } from "@/lib/shopify";
import { GET_SEARCH_RESULTS } from "@/lib/queries/get-search-results";

export async function getSearchResults(query: string, language: string, country: string) {
  const result = await shopifyQuery<GetSearchResultsQuery, GetSearchResultsQueryVariables>(
    GET_SEARCH_RESULTS,
    {
      query,
      language: language as LanguageCode,
      country: country as CountryCode,
    }
  );

  const products = flattenConnection(result.search).filter(
    (item) => item.__typename === "Product"
  ) as Product[];

  return { products };
}

