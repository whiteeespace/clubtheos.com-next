import { createStorefrontClient } from "@shopify/hydrogen-react";
import type { DocumentNode } from "graphql";
import { print } from "graphql";

import { API_VERSION } from "@utils/consts";

const shopifyDomain = process.env.NEXT_PUBLIC_STOREFRONT_ID
  ? `https://${process.env.NEXT_PUBLIC_STOREFRONT_ID}.myshopify.com`
  : undefined;

const privateToken = process.env.SHOPIFY_PRIVATE_API_TOKEN;

export const storefrontClient = createStorefrontClient({
  storeDomain: shopifyDomain,
  publicStorefrontToken: process.env.NEXT_PUBLIC_STOREFRONT_API_TOKEN,
  storefrontApiVersion: API_VERSION,
  privateStorefrontToken: privateToken,
});

/**
 * Server-side Shopify Storefront API query function.
 * Uses private token if available for better rate limits and security.
 */
export async function shopifyQuery<TData, TVariables = Record<string, unknown>>(
  query: DocumentNode,
  variables?: TVariables
): Promise<TData> {
  // Use private token headers if available, otherwise fall back to public
  const headers = privateToken
    ? storefrontClient.getPrivateTokenHeaders()
    : storefrontClient.getPublicTokenHeaders();

  const response = await fetch(storefrontClient.getStorefrontApiUrl(), {
    method: "POST",
    headers: {
      ...headers,
      accept: "application/json",
    },
    body: JSON.stringify({
      query: print(query),
      variables,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront API request failed: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as { data?: TData; errors?: unknown };

  if (json.errors) {
    throw new Error(`Shopify Storefront API errors: ${JSON.stringify(json.errors)}`);
  }

  if (!json.data) {
    throw new Error("Shopify Storefront API response missing data");
  }

  return json.data;
}
