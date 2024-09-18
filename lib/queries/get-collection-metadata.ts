import { graphql } from "gql";

export const GET_COLLECTION_METADATA = graphql(`
  query GetCollectionMetaData($collectionHandle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collection(handle: $collectionHandle) {
      id
      title
      descriptionHtml
      products(first: 1) {
        filters {
          id
          label
          values {
            id
            label
            count
          }
        }
      }
    }
  }
`);
