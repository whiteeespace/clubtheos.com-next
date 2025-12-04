import { GetNavigationSectionsQuery, LanguageCode } from "@/gql/graphql";
import { shopifyQuery } from "@/lib/shopify";
import { GET_NAVIGATION_SECTIONS } from "@/lib/queries/navigation/get-navigation-sections";

export async function getNavigationSections(language: LanguageCode) {
  const result = await shopifyQuery<GetNavigationSectionsQuery>(GET_NAVIGATION_SECTIONS, {
    language,
  });
  return result;
}

