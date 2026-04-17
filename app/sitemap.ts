import { flattenConnection } from "@shopify/hydrogen-react";
import { MetadataRoute } from "next";

import { GetCollectionQuery, GetCollectionQueryVariables } from "@/gql/graphql";
import { defaultLocale, locales } from "@/i18n/types";
import { GET_COLLECTION } from "@/lib/queries/get-collection";
import { baseUrl } from "@utils/base-url";
import { validateEnvironmentVariables } from "@utils/environment-variables";
import { shopifyQuery } from "@utils/shopify";

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
  const productRoutes: MetadataRoute.Sitemap = [];

  while (hasNextPage) {
     
    const data: GetCollectionQuery = await shopifyQuery<GetCollectionQuery, GetCollectionQueryVariables>(
      GET_COLLECTION,
      {
        collectionHandle: "shop-all",
        after,
      }
    );

    const collection = data.collection;
    const products = collection ? flattenConnection(collection.products) : null;
    const newProductRoutes =
      products?.map((product) =>
        getEntry(`/product/${product.handle}`, "weekly", [String(product.featuredImage?.url ?? "")])
      ) ?? [];

    productRoutes.push(...newProductRoutes);
    hasNextPage = collection?.products?.pageInfo?.hasNextPage ?? false;
    after = collection?.products?.pageInfo?.endCursor ?? undefined;
  }

  return [...routesMap, ...productRoutes] as MetadataRoute.Sitemap;
}
