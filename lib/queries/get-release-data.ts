import { graphql } from "gql";

export const GET_RELEASE_DATA = graphql(`
  query GetLatestRelease($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobjects(first: 1, type: "releases", sortKey: "updated_at") {
      nodes {
        name: field(key: "name") {
          value
        }
        releaseOn: field(key: "released_on") {
          value
        }
        closeOn: field(key: "closed_on") {
          value
        }
        password: field(key: "early_access_password") {
          value
        }
        isSpecialCollection: field(key: "special_collection") {
          value
        }
        collection: field(key: "collection") {
          reference {
            __typename
            ... on Collection {
              ...ReleaseCollectionFields
            }
          }
        }
        multipleCollections: field(key: "multiple_collections") {
          references(first: 20) {
            nodes {
              __typename
              ... on Collection {
                ...ReleaseCollectionFields
              }
            }
          }
        }
      }
    }
  }

  fragment ReleaseCollectionFields on Collection {
    id
    handle
    title
    descriptionHtml
    image {
      url
      altText
      width
      height
    }
    fullRowImage: metafield(namespace: "custom", key: "full_row_image") {
      reference {
        __typename
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
        __typename
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
          __typename
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
    releaseMessage: metafield(namespace: "custom", key: "release_message") {
      value
    }
  }
`);
