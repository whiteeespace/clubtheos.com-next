import { unstable_cache as nextCache } from "next/cache";

import { GetLatestReleaseQuery, LanguageCode, ReleaseCollectionFieldsFragment } from "@/gql/graphql";
import { parseMetaobject, ValueMetaobject } from "@/lib/metaobjects";
import { GET_RELEASE_DATA } from "@/lib/queries/get-release-data";
import { shopifyQuery } from "@/lib/shopify";

export interface VideoSource {
  url: string;
  mimeType: string;
  width: number;
  height: number;
}

export interface CollectionImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface ReleaseCollection {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  releaseMessage: string | null;
  /** Shopify collection image (used for multi-collection picker). */
  collectionImage: CollectionImage | null;
  /**
   * `custom.full_row_image` metafield — wide image for the hero tile that spans
   * both columns on desktop when the collection count is odd.
   */
  fullRowImage: CollectionImage | null;
  videoSources: VideoSource[];
  images: CollectionImage[];
}

export interface ReleaseData {
  releaseOn: string | null;
  closeOn: string | null;
  password: string | null;
  isSpecialCollection: boolean;
  collection: ReleaseCollection | null;
  /** Populated from metaobject field `multiple_collections` (list of collection references). */
  collections: ReleaseCollection[];
}

/** First entry in `multiple_collections` when set; otherwise the single `collection` handle. */
export function getReleasePrimaryCollectionHandle(data: ReleaseData | null): string | null {
  if (!data) return null;
  if (data.collections.length > 0) {
    return data.collections[0]?.handle ?? null;
  }
  return data.collection?.handle ?? null;
}

/** Special release with a multi-collection picker on home (navbar logo should return to `/`). */
export function isMultiCollectionRelease(data: ReleaseData | null): boolean {
  return !!data && data.isSpecialCollection && data.collections.length > 0;
}

function parseCollectionFields(reference: ReleaseCollectionFieldsFragment): ReleaseCollection {
  const videoRef = reference.video?.reference;
  const imagesRef = reference.images?.references?.nodes;

  const videoSources: VideoSource[] = videoRef?.__typename === "Video" ? videoRef.sources : [];

  const images: CollectionImage[] = (imagesRef ?? [])
    .filter((node) => node.__typename === "MediaImage" && node.image)
    .map((node) => {
      const mediaImage = node as {
        __typename: "MediaImage";
        image: { url: string; altText?: string | null; width?: number | null; height?: number | null };
      };
      return {
        url: mediaImage.image.url,
        altText: mediaImage.image.altText ?? null,
        width: mediaImage.image.width ?? null,
        height: mediaImage.image.height ?? null,
      };
    });

  const collectionImage = reference.image
    ? {
        url: String(reference.image.url),
        altText: reference.image.altText ?? null,
        width: reference.image.width ?? null,
        height: reference.image.height ?? null,
      }
    : null;

  const fullRowRef = reference.fullRowImage?.reference;
  const fullRowImage: CollectionImage | null =
    fullRowRef?.__typename === "MediaImage" && fullRowRef.image
      ? {
          url: String(fullRowRef.image.url),
          altText: fullRowRef.image.altText ?? null,
          width: fullRowRef.image.width ?? null,
          height: fullRowRef.image.height ?? null,
        }
      : null;

  return {
    id: reference.id,
    handle: reference.handle,
    title: reference.title,
    descriptionHtml: (reference.descriptionHtml as string) ?? "",
    releaseMessage: reference.releaseMessage?.value ?? null,
    collectionImage,
    fullRowImage,
    videoSources,
    images,
  };
}

function parseCollection(
  collectionField: GetLatestReleaseQuery["metaobjects"]["nodes"][0]["collection"]
): ReleaseCollection | null {
  const reference = collectionField?.reference;
  if (reference?.__typename !== "Collection") return null;
  return parseCollectionFields(reference as ReleaseCollectionFieldsFragment);
}

function parseCollectionsList(
  field: GetLatestReleaseQuery["metaobjects"]["nodes"][0]["multipleCollections"]
): ReleaseCollection[] {
  const nodes = field?.references?.nodes ?? [];
  const out: ReleaseCollection[] = [];
  for (const node of nodes) {
    if (node?.__typename === "Collection") {
      out.push(parseCollectionFields(node as ReleaseCollectionFieldsFragment));
    }
  }
  return out;
}

async function fetchReleaseData(language: LanguageCode): Promise<ReleaseData | null> {
  const result = await shopifyQuery<GetLatestReleaseQuery>(GET_RELEASE_DATA, { language });
  const node = result.metaobjects.nodes[0];
  if (!node) return null;

  const releaseOn = parseMetaobject<ValueMetaobject>(node.releaseOn)?.value ?? null;
  const closeOn = parseMetaobject<ValueMetaobject>(node.closeOn)?.value ?? null;
  const password = parseMetaobject<ValueMetaobject>(node.password)?.value ?? null;
  const isSpecialCollection = parseMetaobject<ValueMetaobject>(node.isSpecialCollection)?.value === "true";
  const collection = parseCollection(node.collection);
  const collections = parseCollectionsList(node.multipleCollections);

  return { releaseOn, closeOn, password, isSpecialCollection, collection, collections };
}

export const getReleaseData = nextCache(fetchReleaseData, ["release-data"], {
  revalidate: 60,
  tags: ["release-data"],
});
