import {
  CollectionMetaobject,
  getClient,
  parseMetaobject,
  ReferencesMetaobject,
} from "@whiteeespace/core/utils";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";

import { GET_NAVIGATION_SECTIONS } from "@/lib/queries/navigation/get-navigation-sections";
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
  const result = await getClient().query(GET_NAVIGATION_SECTIONS, {
    language: language.toUpperCase() as LanguageCode,
  });
  const navigationSections = result.data;

  if (!navigationSections) return <></>;

  const shopSections = parseMetaobject<ReferencesMetaobject<CollectionMetaobject>>(
    navigationSections.shop?.mainSections
  );
  const shopSalesSection = parseMetaobject<ReferencesMetaobject<CollectionMetaobject>>(
    navigationSections.shop?.salesSections
  );

  const shopItems =
    shopSections.references?.map((collection) => ({
      title: `${collection.collection?.title}`,
      to: `/shop/${collection.collection?.handle}`,
    })) ?? [];
  const shopSalesItems =
    shopSalesSection.references?.map((collection) => ({
      title: `${collection.collection?.title}`,
      to: `/shop/${collection.collection?.handle}`,
      color: "red",
    })) ?? [];

  const collectionsSections = parseMetaobject<ReferencesMetaobject<CollectionMetaobject>>(
    navigationSections.collections?.mainSections
  );

  const collectionsItems = collectionsSections.references?.map((collection) => ({
    title: `${collection.collection?.title}`,
    to: `/collections/${collection.collection?.handle}`,
  }));

  const shopTab: MenuItem = {
    title: t("shop"),
    to: "/shop",
    items: [...shopItems, ...shopSalesItems],
  };

  const collectionsTab: MenuItem = {
    title: t("collections"),
    to: "/collections",
    items: collectionsItems,
  };

  const blogTab: MenuItem = {
    title: t("blog"),
    to: "/blog",
  };

  const mainSections = [shopTab, collectionsTab, blogTab];
  const otherSections = [{ title: t("about_us"), to: "/about" }];
  const mobileOnlySections = [
    {
      title: t("policies.title"),
      to: "/policies",
      items: [
        {
          title: t("policies.shipping_policy"),
          to: "/policies/shipping-policy",
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
          to: "/policies/privacy-policy",
        },
      ],
    },
  ];

  return (
    <>
      <MobileNavBar menuItems={[...mainSections, ...otherSections, ...mobileOnlySections]} />
      <DesktopNavBar leftItems={mainSections} rightItems={otherSections} />
    </>
  );
};

export default Navbar;
