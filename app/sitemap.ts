import { flattenConnection } from "@shopify/hydrogen-react";
import { MetadataRoute } from "next";

import { defaultLocale, locales } from "@/i18n/types";
import { GET_COLLECTION, ShopifyCollectionOperation, getCollectionQuery } from "@/lib/queries/get-collection";
import { baseUrl } from "@utils/base-url";
import { shopifyQuery } from "@utils/shopify";
import { validateEnvironmentVariables } from "@utils/environment-variables";

function getEntry(
  pathname: string,
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" = "weekly",
  images?: string[]
) {
  return {
    url: getUrl(pathname, defaultLocale),
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(locales.map((locale) => [locale, getUrl(pathname, locale)])),
    },
    changeFrequency,
    images,
  };
}

function getUrl(pathname: string, locale: string) {
  return `${baseUrl}/${locale}${pathname === "/" ? "" : pathname}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const routesMap = [getEntry("/"), getEntry("/shop")];

  let hasNextPage = true;
  let after: string | undefined = undefined;
  const productRoutes: MetadataRoute.Sitemap[] = [];

  while (hasNextPage) {
    const data = await shopifyQuery<
      ShopifyCollectionOperation["data"],
      ShopifyCollectionOperation["variables"]
    >(GET_COLLECTION, {
      collectionHandle: "shop-all",
      after,
    });

    const products = data.collection && flattenConnection(data.collection.products);
    const newProductRoutes =
      products?.map((product) =>
        getEntry(`/product/${product.handle}`, "weekly", [product.featuredImage?.url as string])
      ) ?? [];

    productRoutes.push(...newProductRoutes);
    hasNextPage = data.collection?.products?.pageInfo?.hasNextPage ?? false;
    after = data.collection?.products?.pageInfo?.endCursor;
  }

  return [...routesMap, ...productRoutes] as MetadataRoute.Sitemap;
}
