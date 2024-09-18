import { graphql } from "gql";

// TODO: Unusable until we have pageCount in the products

export const GET_COLLECTION_PAGINATION = graphql(`
  query GetCollectionPagination($collectionHandle: String!, $after: String, $filters: [ProductFilter!]) {
    collection(handle: $collectionHandle) {
      id
      products(first: 32, after: $after, filters: $filters) {
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`);
