import { graphql } from "gql";

export const GET_J_ARTHUR_COLLECTION = graphql(`
  query GetJArthurCollection($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collection(handle: "j-arthur-collaboration") {
      id
      title
      description
      video: metafield(namespace: "custom", key: "video") {
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
