import { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";

import { LanguageCode } from "@/gql/graphql";
import { getCollectionMetadata, getReleaseData, getReleasePrimaryCollectionHandle } from "@/lib/data";

import FiltersButton from "./_components/FiltersButton";
import { ShopContent } from "./_components/ShopContent";
import styles from "./styles.module.scss";

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const locale = await getLocale();

  // Use release collection for metadata if available, otherwise shop-all
  const releaseData = await getReleaseData(locale.toUpperCase() as LanguageCode);
  const handle = getReleasePrimaryCollectionHandle(releaseData) ?? "shop-all";

  const { title, description } = await getCollectionMetadata(handle, locale.toUpperCase(), "CA");
  const parentFields = await parent;

  return {
    title: `Club Theos · ${title}`,
    description: description,
    metadataBase: parentFields.metadataBase,
    ...parentFields.robots,
  };
}

const ShopPage = async () => {
  const locale = await getLocale();

  // Fetch release data - default to release collection if available, otherwise shop-all
  const releaseData = await getReleaseData(locale.toUpperCase() as LanguageCode);
  const collectionHandle = getReleasePrimaryCollectionHandle(releaseData) ?? "shop-all";

  const { title, description, filters } = await getCollectionMetadata(
    collectionHandle,
    locale.toUpperCase(),
    "CA"
  );

  return (
    <section className={styles["shop-container"]}>
      <div className={styles.header}>
        <div className={styles.main}>
          <h1 className={styles.title}>{title}</h1>
          <FiltersButton />
        </div>
        {description && (
          <p
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: description ?? "",
            }}
          />
        )}
      </div>
      <ShopContent collectionHandle={collectionHandle} filters={filters} />
    </section>
  );
};

export default ShopPage;
