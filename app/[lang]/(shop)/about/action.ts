"use server";

import { getClient, ImageMetaobject, parseMetaobject, ValueMetaobject } from "@whiteeespace/core/utils";

import { GetAboutPageQuery, GetAboutPageQueryVariables, LanguageCode } from "@/gql/graphql";
import { GET_ABOUT_PAGE } from "@utils/queries/get-about-page-data";

export const getAboutData = async (language: string) => {
  const client = getClient();
  const result = await client.query<GetAboutPageQuery, GetAboutPageQueryVariables>(GET_ABOUT_PAGE, {
    language: language as LanguageCode,
  });

  const shopImage = parseMetaobject<ImageMetaobject>(result.data?.metaobject?.shopImage);
  const shopHours = parseMetaobject<ValueMetaobject>(result.data?.metaobject?.shopHours);
  const shopHourText = parseMetaobject<ValueMetaobject>(result.data?.metaobject?.shopHourText);
  const shopHolidayHours = parseMetaobject<ValueMetaobject>(result.data?.metaobject?.shopHolidayHours);
  const shopAddress = parseMetaobject<ValueMetaobject>(result.data?.metaobject?.shopAddress);
  const shopPhoneNumber = parseMetaobject<ValueMetaobject>(result.data?.metaobject?.shopPhoneNumber);
  const shopDescription = parseMetaobject<ValueMetaobject>(result.data?.metaobject?.shopDescription);

  return {
    shopImage,
    shopHours,
    shopHourText,
    shopHolidayHours,
    shopAddress,
    shopPhoneNumber,
    shopDescription,
  };
};
