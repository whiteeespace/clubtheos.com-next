import { flattenConnection, makeClient } from "@whiteeespace/core/utils";
import { getLocale } from "next-intl/server";

import Item from "@theos/Item";
import { Link } from "@utils/navigation";
import { GET_SEARCH_RESULTS } from "@utils/queries/get-search-results";
import {
  CountryCode,
  GetSearchResultsQuery,
  GetSearchResultsQueryVariables,
  LanguageCode,
  Product,
} from "gql/graphql";

import styles from "./styles.module.scss";

const SearchPage = async ({ searchParams }) => {
  const query = searchParams.q;
  const locale = await getLocale();

  const client = makeClient();
  const result = await client.query<GetSearchResultsQuery, GetSearchResultsQueryVariables>(
    GET_SEARCH_RESULTS,
    { query, language: locale.toUpperCase() as LanguageCode, country: "CA" as CountryCode }
  );

  const products = flattenConnection(result?.data?.search).filter(
    (item) => item.__typename === "Product"
  ) as Product[];

  if (!products || !products.length) {
    return <>no results...</>;
  }

  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <h1 className={styles["title"]}>search results for &quot;{query}&quot;</h1>
      </div>
      <div className={styles["products-container"]}>
        <div className={styles["products"]}>
          {products.map((product) => (
            <Link href={`/product/${product.handle}`} key={product.handle}>
              {product && <Item product={product} />}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
