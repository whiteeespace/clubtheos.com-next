import { graphql } from "gql";

export const GET_PRIVACY_POLICY = graphql(`
  query GetPrivacyPolicy($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        id
        handle
        title
        body
      }
    }
  }
`);
