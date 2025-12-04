import { GetNavigationSectionsQuery, LanguageCode } from "@/gql/graphql";
import { GET_NAVIGATION_SECTIONS } from "@/lib/queries/navigation/get-navigation-sections";
import { shopifyQuery } from "@/lib/shopify";

export async function getNavigationSections(language: LanguageCode) {
  const result = await shopifyQuery<GetNavigationSectionsQuery>(GET_NAVIGATION_SECTIONS, {
    language,
  });
  return result;
}

