import { getLocale, getTranslations } from "next-intl/server";
import React from "react";

import { LanguageCode } from "@/gql/graphql";
import { getBanner, getNavigationSections } from "@/lib/data";

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
  
  const navigationSections = await getNavigationSections(language.toUpperCase() as LanguageCode);
  if (!navigationSections) return <></>;

  const banner = await getBanner(language.toUpperCase() as LanguageCode);

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
        banner={banner.show ? banner.text ?? undefined : undefined}
      />
      <DesktopNavBar
        rightItems={otherSections}
        banner={banner.show ? banner.text ?? undefined : undefined}
      />
    </>
  );
};

export default Navbar;
