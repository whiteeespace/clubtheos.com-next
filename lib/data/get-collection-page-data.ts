import { unstable_cache as nextCache } from "next/cache";

import {
  CountryCode,
  GetCollectionPageDataQuery,
  GetCollectionPageDataQueryVariables,
  LanguageCode,
} from "@/gql/graphql";
import { GET_COLLECTION_PAGE_DATA } from "@/lib/queries/get-collection-page-data";
import { shopifyQuery } from "@/lib/shopify";

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
  productImages: CollectionPageImage[];
  firstProductHandle: string | null;
}

type CollectionType = NonNullable<GetCollectionPageDataQuery["collection"]>;
type ImageMetafield = CollectionType["images"];

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

  const collection = result.collection;
  if (!collection) return null;

  const videoRef = collection.video?.reference;
  const videoSources: CollectionPageVideoSource[] = videoRef && "sources" in videoRef ? videoRef.sources : [];

  const collectionImage: CollectionPageImage | null = collection.image
    ? {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Shopify URL scalar is typed as any
        url: collection.image.url as string,
        altText: collection.image.altText ?? null,
        width: collection.image.width ?? null,
        height: collection.image.height ?? null,
      }
    : null;

  return {
    id: collection.id,
    handle: collection.handle,
    title: collection.title,
    description: collection.description ?? null,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Shopify HTML scalar is typed as any
    descriptionHtml: (collection.descriptionHtml as string) ?? null,
    collectionImage,
    videoSources,
    images: parseImages(collection.images),
    productImages: parseImages(collection.productImages),
    firstProductHandle: collection.products.nodes[0]?.handle ?? null,
  };
}

export const getCollectionPageData: typeof fetchCollectionPageData = nextCache(
  fetchCollectionPageData,
  ["collection-page-data"],
  {
    revalidate: 60,
    tags: ["collection-page-data"],
  }
);
