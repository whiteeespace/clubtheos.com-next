import { graphql } from "gql";

export const GET_J_ARTHUR_COLLECTION = graphql(`
  query GetJArthurCollection($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: { handle: "theos-x-art-by-j-arthur", type: "j_arthur_collaboration_merch_page" }) {
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
      mainVideoMobile: field(key: "main_video_mobile") {
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
      title: field(key: "title") {
        value
      }
      description: field(key: "description") {
        value
      }
    }
    collection(handle: "j-arthur-collaboration") {
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
