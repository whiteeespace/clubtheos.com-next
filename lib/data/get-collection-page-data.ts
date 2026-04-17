import { unstable_cache as nextCache } from "next/cache";

import {
  CountryCode,
  GetCollectionPageByNodeIdQuery,
  GetCollectionPageByNodeIdQueryVariables,
  GetCollectionPageDataQuery,
  GetCollectionPageDataQueryVariables,
  LanguageCode,
} from "@/gql/graphql";
import { getReleaseData } from "@/lib/data/get-release-data";
import {
  GET_COLLECTION_PAGE_BY_NODE_ID,
  GET_COLLECTION_PAGE_DATA,
} from "@/lib/queries/get-collection-page-data";
import { shopifyQuery } from "@/lib/shopify";

export type CollectionPageProduct = NonNullable<
  GetCollectionPageDataQuery["collection"]
>["products"]["nodes"][number];

export interface CollectionPageVideoSource {
  url: string;
  mimeType: string;
  width: number;
  height: number;
}

export interface CollectionPageImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface CollectionPageData {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  descriptionHtml: string | null;
  collectionImage: CollectionPageImage | null;
  videoSources: CollectionPageVideoSource[];
  images: CollectionPageImage[];
  products: CollectionPageProduct[];
}

type CollectionFromHandleQuery = NonNullable<GetCollectionPageDataQuery["collection"]>;
type ImageMetafield = CollectionFromHandleQuery["images"];

function parseTitleImage(metafield: CollectionFromHandleQuery["titleImage"]): CollectionPageImage | null {
  const ref = metafield?.reference;
  if (!ref || !("image" in ref) || !ref.image) return null;
  return {
     
    url: ref.image.url as string,
    altText: ref.image.altText ?? null,
    width: ref.image.width ?? null,
    height: ref.image.height ?? null,
  };
}

function parseImages(metafield: ImageMetafield): CollectionPageImage[] {
  const refs = metafield?.references?.nodes ?? [];
  return refs
    .filter(
      (
        node
      ): node is {
        image: { url: string; altText?: string | null; width?: number | null; height?: number | null };
      } => "image" in node && node.image !== null && node.image !== undefined
    )
    .map((node) => ({
      url: node.image.url,
      altText: node.image.altText ?? null,
      width: node.image.width ?? null,
      height: node.image.height ?? null,
    }));
}

function mapCollectionToPageData(collection: CollectionFromHandleQuery): CollectionPageData {
  const videoRef = collection.video?.reference;
  const videoSources: CollectionPageVideoSource[] = videoRef && "sources" in videoRef ? videoRef.sources : [];

  const collectionImage = parseTitleImage(collection.titleImage);

  return {
    id: collection.id,
    handle: collection.handle,
    title: collection.title,
    description: collection.description ?? null,
     
    descriptionHtml: (collection.descriptionHtml as string) ?? null,
    collectionImage,
    videoSources,
    images: parseImages(collection.images),
    products: collection.products.nodes,
  };
}

function collectionFromNodeQuery(
  data: GetCollectionPageByNodeIdQuery
): CollectionPageData | null {
  const node = data.node;
  if (node?.__typename !== "Collection") return null;
  return mapCollectionToPageData(node);
}

async function fetchCollectionPageData(
  handle: string,
  language: string,
  country: string
): Promise<CollectionPageData | null> {
  const result = await shopifyQuery<GetCollectionPageDataQuery, GetCollectionPageDataQueryVariables>(
    GET_COLLECTION_PAGE_DATA,
    {
      handle,
      language: language as LanguageCode,
      country: country as CountryCode,
    }
  );

  if (result.collection) {
    return mapCollectionToPageData(result.collection);
  }

  /** Handle lookup can fail while `node(id:)` still works (e.g. visibility/channel quirks vs metaobject refs). */
  const release = await getReleaseData(language.toUpperCase() as LanguageCode);
  const fromRelease =
    release?.collections.find((c) => c.handle === handle) ??
    (release?.collection?.handle === handle ? release.collection : undefined);
  if (!fromRelease) return null;

  const byId = await shopifyQuery<
    GetCollectionPageByNodeIdQuery,
    GetCollectionPageByNodeIdQueryVariables
  >(GET_COLLECTION_PAGE_BY_NODE_ID, {
    id: fromRelease.id,
    language: language as LanguageCode,
    country: country as CountryCode,
  });

  return collectionFromNodeQuery(byId);
}

export const getCollectionPageData: typeof fetchCollectionPageData = nextCache(
  fetchCollectionPageData,
  ["collection-page-data"],
  {
    revalidate: 60,
    tags: ["collection-page-data"],
  }
);
