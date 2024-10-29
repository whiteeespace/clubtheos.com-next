"use server";

import {
  flattenConnection,
  getClient,
  ImageMetaobject,
  ParsedMetafields,
  parseMetafield,
  parseMetaobject,
  ReferencesMetaobject,
  ValueMetaobject,
  VideoMetaobject,
} from "@whiteeespace/core/utils";

import {
  Collection,
  GetCollectionsDataQuery,
  GetCollectionsDataQueryVariables,
  GetJArthurCollectionQuery,
  GetJArthurCollectionQueryVariables,
  GetTheosBeanieQuery,
  GetTheosBeanieQueryVariables,
  GetTheosBubblesQuery,
  GetTheosBubblesQueryVariables,
  GetTheosUOneBlockCollectionQuery,
  GetTheosUOneBlockCollectionQueryVariables,
  LanguageCode,
} from "@/gql/graphql";
import { GET_COLLECTIONS_DATA } from "@utils/queries/collections/get-collections-data";
import { GET_J_ARTHUR_COLLECTION } from "@utils/queries/collections/get-j-arthur-collection";
import { GET_THEOS_BEANIE_PAGE } from "@utils/queries/collections/get-theos-beanie-collection";
import { GET_THEOS_BUBBLES_PAGE } from "@utils/queries/collections/get-theos-bubbles-collection";
import { GET_THEOS_U_ONE_BLOCK_COLLECTION } from "@utils/queries/collections/get-theos-u-one-block-collection";

export const getCollectionsData = async (language: string) => {
  const client = getClient();
  const result = await client.query<GetCollectionsDataQuery, GetCollectionsDataQueryVariables>(
    GET_COLLECTIONS_DATA,
    {
      language: language as LanguageCode,
    }
  );

  const redirectUrl = (result.data?.shop?.defaultCollection?.reference as Collection).handle;

  return {
    redirectUrl,
  };
};

export const getTheosBeanieClassOf24Data = async (language: string) => {
  const client = getClient();
  const result = await client.query<GetTheosBeanieQuery, GetTheosBeanieQueryVariables>(
    GET_THEOS_BEANIE_PAGE,
    {
      language: language as LanguageCode,
    }
  );

  const photoshoot = parseMetaobject<ReferencesMetaobject<ImageMetaobject>>(
    result.data?.metaobject?.photoshoot
  ).references;

  const productData =
    result.data?.collection?.products && flattenConnection(result.data?.collection?.products);

  return {
    photoshoot,
    productData,
  };
};

export const getJArthurCollaborationData = async (language: string) => {
  const client = getClient();
  const result = await client.query<GetJArthurCollectionQuery, GetJArthurCollectionQueryVariables>(
    GET_J_ARTHUR_COLLECTION,
    {
      language: language as LanguageCode,
    }
  );

  const mainVideoDesktop = parseMetaobject<VideoMetaobject>(result.data?.metaobject?.mainVideoMobile);
  const mainVideoMobile = parseMetaobject<VideoMetaobject>(result.data?.metaobject?.mainVideo);
  const title = parseMetaobject<ValueMetaobject>(result.data?.metaobject?.title);
  const description = parseMetaobject<ValueMetaobject>(result.data?.metaobject?.description);
  const products = result.data?.collection?.products && flattenConnection(result.data?.collection?.products);

  return {
    mainVideoDesktop,
    mainVideoMobile,
    title,
    description,
    products,
  };
};

export const getTheosBubblesData = async (language: string) => {
  const client = getClient();
  const result = await client.query<GetTheosBubblesQuery, GetTheosBubblesQueryVariables>(
    GET_THEOS_BUBBLES_PAGE,
    {
      language: language as LanguageCode,
    }
  );

  const photoshootData = parseMetaobject<ReferencesMetaobject<ImageMetaobject>>(
    result.data?.metaobject?.photoshootImages
  );
  const title = parseMetaobject<ValueMetaobject>(result.data?.metaobject?.title);
  const productData = flattenConnection(result.data?.collection?.products);

  return {
    photoshootData,
    title,
    productData,
  };
};

export const getTheosUOneBlockData = async (language: string) => {
  const client = getClient();
  const result = await client.query<
    GetTheosUOneBlockCollectionQuery,
    GetTheosUOneBlockCollectionQueryVariables
  >(GET_THEOS_U_ONE_BLOCK_COLLECTION, {
    language: language as LanguageCode,
  });

  const imagesData = result.data?.collection?.images
    ? parseMetafield<ParsedMetafields["list.file_reference"]>(result.data?.collection?.images)
    : undefined;
  const videoData = result.data?.collection?.video
    ? parseMetafield<ParsedMetafields["file_reference"]>(result.data?.collection?.video)
    : undefined;

  const images = imagesData?.references && flattenConnection(imagesData?.references);
  const video = videoData?.reference;
  const description = result.data?.collection?.description;
  const products = flattenConnection(result.data?.collection?.products);

  return {
    images,
    description,
    products,
    video,
  };
};
