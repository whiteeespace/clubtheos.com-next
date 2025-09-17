import { flattenConnection, serverSideFetch, validateEnvironmentVariables } from "@whiteeespace/core/utils";
import { MetadataRoute } from "next";

import { defaultLocale, locales } from "@/i18n";
import { ShopifyCollectionOperation, getCollectionQuery } from "@/lib/queries/get-collection";
import { baseUrl } from "@utils/base-url";

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
    const collection = await serverSideFetch<ShopifyCollectionOperation>({
      query: getCollectionQuery,
      variables: {
        collectionHandle: "shop-all",
        after,
      },
    });

    const products =
      collection.body.data.collection && flattenConnection(collection.body.data.collection.products);
    const newProductRoutes =
      products?.map((product) =>
        getEntry(`/product/${product.handle}`, "weekly", [product.featuredImage?.url as string])
      ) ?? [];

    productRoutes.push(...newProductRoutes);
    hasNextPage = collection.body.data.collection?.products?.pageInfo?.hasNextPage ?? false;
    after = collection.body.data.collection?.products?.pageInfo?.endCursor;
  }

  return [...routesMap, ...productRoutes] as MetadataRoute.Sitemap;
}
