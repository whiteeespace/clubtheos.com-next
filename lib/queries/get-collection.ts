import { GetCollectionQuery } from "@/gql/graphql";
import { graphql } from "gql";

export const getCollectionQuery = /* GraphQL */ `
  query GetCollection(
    $collectionHandle: String!
    $after: String
    $filters: [ProductFilter!]
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $collectionHandle) {
      id
      products(first: 32, after: $after, filters: $filters) {
        nodes {
          handle
          title
          availableForSale
          updatedAt
          featuredImage {
            url
          }
          priceRange {
            maxVariantPrice {
              amount
              currencyCode
            }
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            maxVariantPrice {
              amount
              currencyCode
            }
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export interface ShopifyCollectionOperation {
  data: {
    collection: GetCollectionQuery["collection"];
  };
  variables: {
    collectionHandle: string;
    after?: string;
  };
}

export const GET_COLLECTION = graphql(getCollectionQuery);
