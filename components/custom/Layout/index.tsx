import { getLocale } from "next-intl/server";
import { PropsWithChildren } from "react";

import { LanguageCode } from "@/gql/graphql";
import Clarity from "@components/Clarity";

import Providers from "./Providers";
import Analytics from "../Analytics";

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const locale = await getLocale();
  return (
    <Providers languageCode={locale as LanguageCode}>
      {children}
      <Clarity />
      <Analytics />
    </Providers>
  );
};
export default Layout;
