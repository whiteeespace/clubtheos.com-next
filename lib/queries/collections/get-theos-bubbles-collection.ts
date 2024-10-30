import { graphql } from "gql";

export const GET_THEOS_BUBBLES_PAGE = graphql(`
  query GetTheosBubbles($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collection(handle: "theos-bubbles") {
      id
      title
      images: metafield(namespace: "custom", key: "images") {
        references(first: 10) {
          nodes {
            ... on MediaImage {
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
      products(first: 1) {
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
