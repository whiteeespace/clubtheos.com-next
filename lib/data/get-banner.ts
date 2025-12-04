import { GetBannerQuery, LanguageCode } from "@/gql/graphql";
import { shopifyQuery } from "@/lib/shopify";
import { parseMetaobject, ValueMetaobject } from "@/lib/metaobjects";
import { GET_BANNER } from "@/lib/queries/get-banner";

export async function getBanner(language: LanguageCode) {
  const result = await shopifyQuery<GetBannerQuery>(GET_BANNER, { language });
  const banner = parseMetaobject<ValueMetaobject>(result.metaobject?.text);
  const show = parseMetaobject<ValueMetaobject>(result.metaobject?.show);
  const showBanner = show?.value === "true";

  return {
    text: banner?.value ?? null,
    show: showBanner,
  };
}

