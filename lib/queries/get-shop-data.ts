import { graphql } from "gql";

export const GET_SHOP_DATA = graphql(`
  query GetShopData($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop: metaobject(handle: { handle: "shop", type: "shop_sections" }) {
      name: field(key: "name") {
        value
      }
      defaultSection: field(key: "default_section") {
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
