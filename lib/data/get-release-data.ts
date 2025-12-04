import { unstable_cache as nextCache } from "next/cache";

import { GetLatestReleaseQuery, LanguageCode } from "@/gql/graphql";
import { shopifyQuery } from "@/lib/shopify";
import { parseMetaobject, ValueMetaobject } from "@/lib/metaobjects";
import { GET_RELEASE_DATA } from "@/lib/queries/get-release-data";

export type ReleaseData = {
  releaseOn: string | null;
  closeOn: string | null;
  password: string | null;
};

async function fetchReleaseData(language: LanguageCode): Promise<ReleaseData | null> {
  const result = await shopifyQuery<GetLatestReleaseQuery>(GET_RELEASE_DATA, { language });
  const node = result.metaobjects.nodes[0];
  if (!node) return null;

  const releaseOn = parseMetaobject<ValueMetaobject>(node.releaseOn)?.value ?? null;
  const closeOn = parseMetaobject<ValueMetaobject>(node.closeOn)?.value ?? null;
  const password = parseMetaobject<ValueMetaobject>(node.password)?.value ?? null;

  return { releaseOn, closeOn, password };
}

export const getReleaseData = nextCache(fetchReleaseData, ["release-data"], {
  revalidate: 60,
  tags: ["release-data"],
});

