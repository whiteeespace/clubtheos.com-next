import { RedirectType } from "next/navigation";
import { getLocale } from "next-intl/server";

import { redirect } from "@utils/navigation";

import { getCollectionsData } from "./action";

const CollectionsPage = async () => {
  const locale = await getLocale();
  const { redirectUrl } = await getCollectionsData(locale.toUpperCase());

  redirect(`/collections/${redirectUrl}`, RedirectType.replace);
};

export default CollectionsPage;
