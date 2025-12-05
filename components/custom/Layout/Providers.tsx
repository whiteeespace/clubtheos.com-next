"use client";

import { CartProvider, ShopifyProvider } from "@shopify/hydrogen-react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { PropsWithChildren } from "react";

import { LanguageCode } from "@/gql/graphql";
import { API_VERSION } from "@/lib/consts";

import { ShopProvider } from "./ShopContext";

interface Props extends PropsWithChildren {
  languageCode: LanguageCode;
}

const storefrontDomain = process.env.NEXT_PUBLIC_STOREFRONT_ID
  ? `https://${process.env.NEXT_PUBLIC_STOREFRONT_ID}.myshopify.com`
  : "";

const Providers: React.FC<Props> = ({ children, languageCode }) => (
  <NuqsAdapter>
    <ShopProvider>
      <ShopifyProvider
        storeDomain={storefrontDomain}
        storefrontToken={process.env.NEXT_PUBLIC_STOREFRONT_API_TOKEN ?? ""}
        storefrontApiVersion={API_VERSION}
        countryIsoCode="CA"
        languageIsoCode={languageCode}
      >
        <CartProvider>{children}</CartProvider>
      </ShopifyProvider>
    </ShopProvider>
  </NuqsAdapter>
);

export default Providers;
