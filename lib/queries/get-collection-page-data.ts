import { graphql } from "gql";

export const GET_COLLECTION_PAGE_DATA = graphql(`
  query GetCollectionPageData($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      titleImage: metafield(namespace: "custom", key: "title_image") {
        reference {
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
      images: metafield(namespace: "custom", key: "images") {
        references(first: 20) {
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
      products(first: 50) {
        nodes {
          handle
          title
          availableForSale
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
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

/** Same fields as the collection root query, but via `node(id:)` when handle lookup fails. */
export const GET_COLLECTION_PAGE_BY_NODE_ID = graphql(`
  query GetCollectionPageByNodeId($id: ID!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    node(id: $id) {
      __typename
      ... on Collection {
        id
        handle
        title
        description
        descriptionHtml
        titleImage: metafield(namespace: "custom", key: "title_image") {
          reference {
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
        images: metafield(namespace: "custom", key: "images") {
          references(first: 20) {
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
        products(first: 50) {
          nodes {
            handle
            title
            availableForSale
            featuredImage {
              url
              altText
              width
              height
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              maxVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`);
