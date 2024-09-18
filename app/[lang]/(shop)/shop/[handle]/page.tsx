import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import FiltersButton from "./_components/FiltersButton";
import { Products } from "./_components/Products";
import { ShopFilters } from "./_components/ShopFilters";
import { getCollectionMetadata } from "./action";
import styles from "./styles.module.scss";

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
