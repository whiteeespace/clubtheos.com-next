"use client";

import { UrqlProvider, WhiteeeShopifyProvider } from "@whiteeespace/core";
import { PropsWithChildren } from "react";

import { LanguageCode } from "@/gql/graphql";

import { ShopProvider } from "./ShopContext";

interface Props extends PropsWithChildren {
  languageCode: LanguageCode;
}

const Providers: React.FC<Props> = ({ children, languageCode }) => (
  <ShopProvider>
    <UrqlProvider>
      <WhiteeeShopifyProvider countryCode="CA" languageCode={languageCode}>
        {children}
      </WhiteeeShopifyProvider>
    </UrqlProvider>
  </ShopProvider>
);
export default Providers;
