import { graphql } from "gql";

export const GET_THEOS_BEANIE_PAGE = graphql(`
  query GetTheosBeanie($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collection(handle: "theos-beanie-class-of-24") {
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
