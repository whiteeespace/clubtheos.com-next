import { graphql } from "gql";

export const GET_PRODUCT = graphql(`
  query GetProduct($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      description
      availableForSale
      descriptionHtml
      priceRange {
        maxVariantPrice {
          amount
          currencyCode
        }
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        maxVariantPrice {
          amount
          currencyCode
        }
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 100) {
        edges {
          node {
            url
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            quantityAvailable
            selectedOptions {
              name
              value
            }
            sizeChart: metafield(namespace: "custom", key: "size_chart") {
              type
              value
            }
          }
        }
      }
      sizeGuide: metafield(namespace: "custom", key: "size_guide_type") {
        type
        value
      }
      condition: metafield(namespace: "custom", key: "condition") {
        type
        value
      }
    }
  }
`);
