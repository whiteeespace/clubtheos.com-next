import { getLocale } from "next-intl/server";

import { getSearchResults } from "@/lib/data";
import { ShopProducts } from "@components/ShopProducts";

import styles from "./styles.module.scss";

const SearchPage = async ({ searchParams }: { searchParams: Promise<{ q?: string }> }) => {
  const { q: query } = await searchParams;
  const locale = await getLocale();

  if (!query) {
    return <>no search query...</>;
  }

  const { products } = await getSearchResults(query, locale.toUpperCase(), "CA");

  if (!products || !products.length) {
    return <>no results...</>;
  }

  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <h1 className={styles["title"]}>search results for &quot;{query}&quot;</h1>
      </div>
      <ShopProducts products={products} />
    </div>
  );
};

export default SearchPage;
