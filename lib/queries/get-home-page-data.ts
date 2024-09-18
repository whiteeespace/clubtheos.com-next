import { graphql } from "gql";

export const GET_HOME_PAGE = graphql(`
  query GetHomePage($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: { handle: "home-page", type: "homepage" }) {
      banner: field(key: "banner") {
        reference {
          ... on MediaImage {
            image {
              url
            }
          }
        }
      }
      bannerVideo: field(key: "banner") {
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
      mobileBanner: field(key: "mobile_banner") {
        reference {
          ... on MediaImage {
            image {
              url
            }
          }
        }
      }
      mobileBannerVideo: field(key: "mobile_banner") {
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
      logo: field(key: "logo") {
        reference {
          ... on MediaImage {
            image {
              url
            }
          }
        }
      }
      redirectPath: field(key: "redirect_path") {
        value
      }
    }
  }
`);
