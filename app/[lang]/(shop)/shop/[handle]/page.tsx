import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import FiltersButton from "./_components/FiltersButton";
import { Products } from "./_components/Products";
import { ShopFilters } from "./_components/ShopFilters";
import { getCollectionMetadata } from "./action";
import styles from "./styles.module.scss";

export async function generateMetadata({ params }, parent: ResolvingMetadata): Promise<Metadata> {
  const handle = String(params.handle);
  const locale = await getLocale();
  const { title, description } = await getCollectionMetadata(handle, locale.toUpperCase(), "CA");
  const parentFields = await parent;

  return {
    title: `Club Theos · ${title}`,
    description: description,
    metadataBase: parentFields.metadataBase,
    ...parentFields.robots,
  };
}

const ShopPage = async ({ params }) => {
  const handle = String(params.handle);
  const locale = await getLocale();

  if (!handle) {
    return redirect("/");
  }

  const { title, description, totalProductCount, filters } = await getCollectionMetadata(
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
      <Products collectionHandle={handle} productCount={totalProductCount} />
    </section>
  );
};

export default ShopPage;
