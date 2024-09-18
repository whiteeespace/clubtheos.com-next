import { graphql } from "gql";

export const GET_THEOS_BEANIE_PAGE = graphql(`
  query GetTheosBeanie($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: { handle: "theos-beanie-class-of-24", type: "theos_beanie_class_of_24" }) {
      title: field(key: "title") {
        value
      }
      photoshoot: field(key: "photoshoot") {
        references(first: 50) {
          nodes {
            ... on MediaImage {
              image {
                url
              }
            }
          }
        }
      }
    }
    collection(handle: "theos-beanie-class-of-24") {
      id
      products(first: 10) {
        nodes {
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
