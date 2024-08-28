import { graphql } from "gql";

export const GET_PRODUCT = graphql(`
  query GetProduct($handle: String!) {
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
          }
        }
      }
    }
  }
`);
