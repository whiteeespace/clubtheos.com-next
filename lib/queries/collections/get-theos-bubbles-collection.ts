import { graphql } from "gql";

export const GET_THEOS_BUBBLES_PAGE = graphql(`
  query GetTheosBubbles($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: { handle: "theos-bubbles", type: "theos_bubbles" }) {
      title: field(key: "title") {
        value
      }
      mainVideo: field(key: "main_video") {
        reference {
          ... on Video {
            previewImage {
              url
            }
            sources {
              url
              mimeType
              width
              height
            }
          }
        }
      }
      story: field(key: "story") {
        value
      }
      photoshootImages: field(key: "photoshoot_images") {
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
    collection(handle: "theos-bubbles") {
      id
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
