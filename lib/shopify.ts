import { createStorefrontClient } from "@shopify/hydrogen-react";
import type { DocumentNode } from "graphql";
import { print } from "graphql";
import { headers as nextHeaders } from "next/headers";

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
 * Extracts the buyer's IP address from Next.js request headers.
 * Returns undefined if not available (e.g., during static generation).
 */
export async function getBuyerIp(): Promise<string | undefined> {
  try {
    const headersList = await nextHeaders();
    // x-forwarded-for can contain multiple IPs; first one is the client
    const forwardedFor = headersList.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }
    // Fallback to other common headers
    return (
      headersList.get("x-real-ip") ??
      headersList.get("cf-connecting-ip") ?? // Cloudflare
      undefined
    );
  } catch {
    // headers() throws during static generation - that's fine
    return undefined;
  }
}

/**
 * Server-side Shopify Storefront API query function.
 * Uses private token if available for better rate limits and security.
 * Automatically extracts buyerIp from request headers for analytics.
 */
export async function shopifyQuery<TData, TVariables = Record<string, unknown>>(
  query: DocumentNode,
  variables?: TVariables
): Promise<TData> {
  const buyerIp = await getBuyerIp();

  // Use private token headers if available (with buyerIp for analytics), otherwise fall back to public
  const headers = privateToken
    ? storefrontClient.getPrivateTokenHeaders({ buyerIp })
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
