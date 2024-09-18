import { graphql } from "gql";

export const GET_REFUND_POLICY = graphql(`
  query GetRefundPolicy($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop {
      refundPolicy {
        id
        handle
        title
        body
      }
    }
  }
`);
