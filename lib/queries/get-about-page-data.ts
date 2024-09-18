import { graphql } from "gql";

export const GET_ABOUT_PAGE = graphql(`
  query GetAboutPage($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: { handle: "about-data", type: "about_page" }) {
      shopImage: field(key: "shop_image") {
        reference {
          ... on MediaImage {
            image {
              url
            }
          }
        }
      }
      shopDescription: field(key: "shop_description") {
        value
      }
      shopHourText: field(key: "shop_hour_text") {
        value
      }
      shopHours: field(key: "shop_hours") {
        value
      }
      shopAddress: field(key: "shop_address") {
        value
      }
      shopPhoneNumber: field(key: "shop_phone_number") {
        value
      }
      shopHolidayHours: field(key: "shop_holiday_hours") {
        value
      }
    }
  }
`);
