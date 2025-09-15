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
      }
    }
  }
`);
