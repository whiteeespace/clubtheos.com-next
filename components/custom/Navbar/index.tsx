import { getClient, parseMetaobject, ValueMetaobject } from "@whiteeespace/core/utils";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";

import { GET_NAVIGATION_SECTIONS } from "@/lib/queries/navigation/get-navigation-sections";
import { GET_BANNER } from "@utils/queries/get-banner";
import { LanguageCode } from "gql/graphql";

import { DesktopNavBar } from "./Desktop";
import { MobileNavBar } from "./Mobile";

export interface MenuItem {
  title: string;
  to?: string;
  items?: MenuItem[];
  color?: string;
  onClick?: () => void;
}

const Navbar: React.FC = async () => {
  const language = await getLocale();
  const t = await getTranslations("navigation");
  const client = getClient();
  const result = await client.query(GET_NAVIGATION_SECTIONS, {
    language: language.toUpperCase() as LanguageCode,
  });
  const navigationSections = result.data;
  if (!navigationSections) return <></>;

  const bannerResult = await client.query(GET_BANNER, {
    language: language.toUpperCase() as LanguageCode,
  });
  const banner = parseMetaobject<ValueMetaobject>(bannerResult.data?.metaobject?.text);
  const show = parseMetaobject<ValueMetaobject>(bannerResult?.data?.metaobject?.show);
  const showBanner = show?.value === "true";

  const mainSections = [];
  const otherSections = [];
  const mobileOnlySections = [
    {
      title: t("policies.title"),
      to: "/policies",
      items: [
        {
          title: t("policies.shipping_policy"),
          to: "/policies/shipping",
        },
        {
          title: t("policies.returns_and_exchanges"),
          to: "/policies/returns-and-exchanges",
        },
        {
          title: t("policies.terms_and_conditions"),
          to: "/policies/terms-and-conditions",
        },
        {
          title: t("policies.privacy_policy"),
          to: "/policies/privacy",
        },
      ],
    },
  ];

  return (
    <>
      <MobileNavBar
        menuItems={[...mainSections, ...otherSections, ...mobileOnlySections]}
        banner={showBanner ? banner.value : undefined}
      />
      <DesktopNavBar rightItems={otherSections} banner={showBanner ? banner.value : undefined} />
    </>
  );
};

export default Navbar;
