"use server";

import { getClient } from "@whiteeespace/core/utils";
import { revalidatePath } from "next/cache";

import {
  CountryCode,
  GetCollectionMetaDataQuery,
  GetCollectionMetaDataQueryVariables,
  LanguageCode,
} from "@/gql/graphql";
import { GET_COLLECTION_METADATA } from "@utils/queries/get-collection-metadata";

export const getCollectionMetadata = async (handle: string, language: string, country: string) => {
  const client = getClient();

  const result = await client.query<GetCollectionMetaDataQuery, GetCollectionMetaDataQueryVariables>(
    GET_COLLECTION_METADATA,
    {
      collectionHandle: handle,
      language: language as LanguageCode,
      country: country as CountryCode,
    }
  );

  const collection = result.data?.collection;

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

  revalidatePath(`/${language}/shop/${handle}`);

  return {
    title: collection?.title,
    description: collection?.descriptionHtml,
    filters: filtersOptions,
  };
};
