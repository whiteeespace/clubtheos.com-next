import { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";

import FiltersButton from "./_components/FiltersButton";
import { Products } from "./_components/Products";
import { ShopFilters } from "./_components/ShopFilters";
import { getCollectionMetadataCached } from "./action";
import styles from "./styles.module.scss";

// eslint-disable-next-line no-empty-pattern
export async function generateMetadata({}, parent: ResolvingMetadata): Promise<Metadata> {
  const handle = "shop-all";
  const locale = await getLocale();
  const { title, description } = await getCollectionMetadataCached(handle, locale.toUpperCase(), "CA");
  const parentFields = await parent;

  return {
    title: `Club Theos · ${title}`,
    description: description,
    metadataBase: parentFields.metadataBase,
    ...parentFields.robots,
  };
}

const ShopPage = async () => {
  const handle = "shop-all";
  const locale = await getLocale();
  const { title, description, filters } = await getCollectionMetadataCached(
    handle,
    locale.toUpperCase(),
    "CA"
  );

  return (
    <section className={styles["shop-container"]}>
      <div className={styles["header"]}>
        <div className={styles["main"]}>
          <h1 className={styles["title"]}>{title}</h1>
          <FiltersButton />
        </div>
        {description && (
          <p
            className={styles["description"]}
            dangerouslySetInnerHTML={{
              __html: description ?? "",
            }}
          />
        )}
      </div>
      <ShopFilters filters={filters} />
      <Products collectionHandle={handle} />
    </section>
  );
};

export default ShopPage;
