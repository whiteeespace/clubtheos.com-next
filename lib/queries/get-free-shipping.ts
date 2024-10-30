import { graphql } from "gql";

export const GET_FREE_SHIPPING = graphql(`
  query GetFreeShipping($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: { handle: "free-shipping", type: "shop_metadata" }) {
      text: field(key: "text") {
        value
      }
      show: field(key: "show") {
        value
      }
    }
  }
`);
