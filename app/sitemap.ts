import { flattenConnection, serverSideFetch, validateEnvironmentVariables } from "@whiteeespace/core/utils";
import { MetadataRoute } from "next";

import { ShopifyCollectionOperation, getCollectionQuery } from "@/lib/queries/get-collection";
import { baseUrl } from "@utils/base-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const routesMap = ["", "/shop"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const collection = await serverSideFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    variables: {
      collectionHandle: "shop-all",
    },
  });

  const products =
    collection.body.data.collection && flattenConnection(collection.body.data.collection.products);
  const productRoutes =
    products?.map((product) => ({
      url: `${baseUrl}/product/${product.handle}`,
      lastModified: (product.updatedAt as string) ?? new Date().toISOString(),
    })) ?? [];

  return [...routesMap, ...productRoutes];
}
