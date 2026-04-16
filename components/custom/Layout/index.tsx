import { getLocale } from "next-intl/server";
import { PropsWithChildren } from "react";

import { LanguageCode } from "@/gql/graphql";
import { getReleaseData, getReleasePrimaryCollectionHandle } from "@/lib/data";
import Clarity from "@components/Clarity";

import Analytics from "../Analytics";

import Providers from "./Providers";

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const locale = await getLocale();
  const releaseData = await getReleaseData(locale.toUpperCase() as LanguageCode);
  const releaseCollectionHandle = getReleasePrimaryCollectionHandle(releaseData);

  return (
    <Providers languageCode={locale as LanguageCode} releaseCollectionHandle={releaseCollectionHandle}>
      {children}
      <Clarity />
      <Analytics />
    </Providers>
  );
};
export default Layout;
