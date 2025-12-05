import { unstable_cache as nextCache } from "next/cache";

import { GetLatestReleaseQuery, LanguageCode } from "@/gql/graphql";
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
  videoSources: VideoSource[];
  images: CollectionImage[];
}

export interface ReleaseData {
  releaseOn: string | null;
  closeOn: string | null;
  password: string | null;
  collection: ReleaseCollection | null;
}

function parseCollection(
  collectionField: GetLatestReleaseQuery["metaobjects"]["nodes"][0]["collection"]
): ReleaseCollection | null {
  const reference = collectionField?.reference;
  if (reference?.__typename !== "Collection") return null;

  const videoRef = reference.video?.reference;
  const imagesRef = reference.images?.references?.nodes;

  const videoSources: VideoSource[] = videoRef?.__typename === "Video" ? videoRef.sources : [];

  const images: CollectionImage[] = (imagesRef ?? [])
    .filter((node) => node.__typename === "MediaImage" && node.image)
    .map((node) => {
      // Type narrowed by filter above
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

  return {
    id: reference.id,
    handle: reference.handle,
    title: reference.title,
    descriptionHtml: reference.descriptionHtml,
    videoSources,
    images,
  };
}

async function fetchReleaseData(language: LanguageCode): Promise<ReleaseData | null> {
  const result = await shopifyQuery<GetLatestReleaseQuery>(GET_RELEASE_DATA, { language });
  const node = result.metaobjects.nodes[0];
  if (!node) return null;

  const releaseOn = parseMetaobject<ValueMetaobject>(node.releaseOn)?.value ?? null;
  const closeOn = parseMetaobject<ValueMetaobject>(node.closeOn)?.value ?? null;
  const password = parseMetaobject<ValueMetaobject>(node.password)?.value ?? null;
  const collection = parseCollection(node.collection);

  return { releaseOn, closeOn, password, collection };
}

export const getReleaseData = nextCache(fetchReleaseData, ["release-data"], {
  revalidate: 60,
  tags: ["release-data"],
});
