import { graphql } from "gql";

export const GET_SHIPPING_POLICY = graphql(`
  query GetShippingPolicy($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop {
      shippingPolicy {
        id
        handle
        title
        body
      }
    }
  }
`);
