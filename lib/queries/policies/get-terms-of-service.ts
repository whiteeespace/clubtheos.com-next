import { graphql } from "gql";

export const GET_TERMS_OF_SERVICE = graphql(`
  query GetTermsOfService($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop {
      termsOfService {
        id
        handle
        title
        body
      }
    }
  }
`);
