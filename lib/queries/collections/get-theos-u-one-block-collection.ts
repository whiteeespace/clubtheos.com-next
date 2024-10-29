import { graphql } from "gql";

export const GET_THEOS_U_ONE_BLOCK_COLLECTION = graphql(`
  query GetTheosUOneBlockCollection($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collection(handle: "theos-u-one-block") {
      id
      description
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
      products(first: 2) {
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
