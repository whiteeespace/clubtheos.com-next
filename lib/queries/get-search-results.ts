import { graphql } from "gql";

export const GET_SEARCH_RESULTS = graphql(`
  query GetSearchResults($query: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    search(first: 32, query: $query, types: [PRODUCT], unavailableProducts: LAST) {
      nodes {
        ... on Product {
          handle
          title
          availableForSale
          featuredImage {
            url
          }
          priceRange {
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`);
