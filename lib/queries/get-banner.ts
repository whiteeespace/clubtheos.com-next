import { graphql } from "gql";

export const GET_BANNER = graphql(`
  query GetBanner($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: { handle: "shop-banner", type: "shop_metadata" }) {
      text: field(key: "text") {
        value
      }
    }
  }
`);
