import { graphql } from "gql";

export const GET_COLLECTION_PRODUCT_COUNT = graphql(`
  query GetCollectionProductCount(
    $collectionHandle: String!
    $filters: [ProductFilter!]
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $collectionHandle) {
      id
      title
      descriptionHtml
      products(first: 0, filters: $filters) {
        filters {
          id
          values {
            count
          }
        }
      }
    }
  }
`);
