import { unstable_cache as nextCache } from "next/cache";

import {
  CountryCode,
  GetCollectionMetaDataQuery,
  GetCollectionMetaDataQueryVariables,
  LanguageCode,
} from "@/gql/graphql";
import { GET_COLLECTION_METADATA } from "@/lib/queries/get-collection-metadata";
import { shopifyQuery } from "@/lib/shopify";

// Filter type from GraphQL query result (subset of the full Filter type)
type CollectionFilter = NonNullable<
  GetCollectionMetaDataQuery["collection"]
>["products"]["filters"][number];

interface CollectionFilters {
  productType?: CollectionFilter;
  color?: CollectionFilter;
  size?: CollectionFilter;
}

interface CollectionMetadataResult {
  title: string | null;
  description: string | null;
  filters: CollectionFilters;
}

async function fetchCollectionMetadata(
  handle: string,
  language: string,
  country: string
): Promise<CollectionMetadataResult> {
  const result = await shopifyQuery<GetCollectionMetaDataQuery, GetCollectionMetaDataQueryVariables>(
    GET_COLLECTION_METADATA,
    {
      collectionHandle: handle,
      language: language as LanguageCode,
      country: country as CountryCode,
    }
  );

  const collection = result.collection;

  const productTypeFilter = collection?.products.filters.find(
    (filter) => filter.id === "filter.p.product_type"
  );
  const colorFilter = collection?.products.filters.find((filter) => filter.id === "filter.v.option.color");
  const sizeFilter = collection?.products.filters.find((filter) => filter.id === "filter.v.option.size");

  return {
    title: collection?.title ?? null,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Shopify HTML scalar is typed as any
    description: collection?.descriptionHtml ?? null,
    filters: {
      productType: productTypeFilter,
      color: colorFilter,
      size: sizeFilter,
    },
  };
}

// Type assertion needed because nextCache returns a wrapped function with unknown return type
export const getCollectionMetadata: typeof fetchCollectionMetadata = nextCache(
  fetchCollectionMetadata,
  ["collection-metadata"],
  {
    revalidate: 60,
    tags: ["collection-metadata"],
  }
);

