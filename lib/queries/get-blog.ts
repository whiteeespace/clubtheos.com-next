import { graphql } from "gql";

export const GET_BLOG = graphql(`
  query GetBlog($after: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    header: metaobject(handle: { handle: "theos-blogs", type: "blogs_header" }) {
      title: field(key: "title") {
        value
      }
      description: field(key: "description") {
        value
      }
    }
    blog: metaobjects(type: "library", first: 8, after: $after, sortKey: "updated_at") {
      nodes {
        id
        content: field(key: "content") {
          reference {
            ... on MediaImage {
              image {
                url
                altText
                width
                height
              }
            }
            ... on Video {
              previewImage {
                url
                altText
                width
                height
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
        description: field(key: "description") {
          type
          value
        }
        date: field(key: "date") {
          type
          value
        }
        link: field(key: "link") {
          type
          value
        }
        theosOwned: field(key: "theos_image") {
          type
          value
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);
