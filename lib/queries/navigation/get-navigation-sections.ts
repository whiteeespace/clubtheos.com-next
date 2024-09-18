import { graphql } from "gql";

export const GET_NAVIGATION_SECTIONS = graphql(`
  query GetNavigationSections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop: metaobject(handle: { handle: "shop", type: "shop_sections" }) {
      name: field(key: "name") {
        value
      }
      mainSections: field(key: "main_sections") {
        references(first: 50) {
          nodes {
            ... on Collection {
              id
              handle
              title
            }
          }
        }
      }
      salesSections: field(key: "sales_sections") {
        references(first: 50) {
          nodes {
            ... on Collection {
              id
              handle
              title
            }
          }
        }
      }
    }
    collections: metaobject(handle: { handle: "collections", type: "shop_sections" }) {
      name: field(key: "name") {
        value
      }
      mainSections: field(key: "main_sections") {
        references(first: 50) {
          nodes {
            ... on Collection {
              id
              handle
              title
            }
          }
        }
      }
    }
  }
`);
