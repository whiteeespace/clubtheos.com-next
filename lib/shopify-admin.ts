import { createAdminApiClient } from "@shopify/admin-api-client";

import { API_VERSION } from "./consts";

type ShopifyAdminClient = ReturnType<typeof createAdminApiClient>;

const storeDomain = `https://${process.env.NEXT_PUBLIC_STOREFRONT_ID!}.myshopify.com`;
const accessToken = process.env.SHOPIFY_ADMIN_API_TOKEN!;

const shopifyAdminSingleton = (): ShopifyAdminClient => {
  return createAdminApiClient({
    storeDomain,
    apiVersion: API_VERSION,
    accessToken,
  });
};

const globalForShopify = globalThis as unknown as {
  shopifyAdminGlobal: ShopifyAdminClient | undefined;
};

export const shopifyAdmin = globalForShopify.shopifyAdminGlobal ?? shopifyAdminSingleton();

if (process.env.NEXT_PUBLIC_PLATFORM_ENV !== "production") {
  globalForShopify.shopifyAdminGlobal = shopifyAdmin;
}
