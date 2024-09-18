import { graphql } from "gql";

export const GET_COLLECTIONS_DATA = graphql(`
  query GetCollectionsData($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop: metaobject(handle: { handle: "collections", type: "shop_sections" }) {
      name: field(key: "name") {
        value
      }
      defaultCollection: field(key: "default_section") {
        reference {
          ... on Collection {
            id
            handle
          }
        }
      }
    }
  }
`);
