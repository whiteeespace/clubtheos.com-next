import { unstable_cache as nextCache } from "next/cache";

import {
  CountryCode,
  GetCollectionMetaDataQuery,
  GetCollectionMetaDataQueryVariables,
  LanguageCode,
} from "@/gql/graphql";
import { shopifyQuery } from "@/lib/shopify";
import { GET_COLLECTION_METADATA } from "@/lib/queries/get-collection-metadata";

async function fetchCollectionMetadata(handle: string, language: string, country: string) {
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

  const filtersOptions = {
    productType: productTypeFilter,
    color: colorFilter,
    size: sizeFilter,
  };

  return {
    title: collection?.title ?? null,
    description: collection?.descriptionHtml ?? null,
    filters: filtersOptions,
  };
}

export const getCollectionMetadata = nextCache(fetchCollectionMetadata, ["collection-metadata"], {
  revalidate: 60,
  tags: ["collection-metadata"],
});

