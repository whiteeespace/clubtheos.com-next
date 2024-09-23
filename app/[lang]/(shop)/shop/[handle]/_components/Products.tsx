"use client";

import { useQuery } from "@whiteeespace/core";
import { useTranslations } from "next-intl";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { Suspense, useEffect } from "react";

import { ShopVariables, useShopContext } from "@components/Layout/ShopContext";
import { ShopProducts } from "@components/ShopProducts";
import Loader from "@theos/Loader";
import { getFilters } from "@utils/filters";
import useInfiniteScroll from "@utils/hooks/use-infinite-scroll";
import { GET_COLLECTION } from "@utils/queries/get-collection";

import styles from "../styles.module.scss";

interface ShopResultsProps {
  variables: ShopVariables;
  isLastPage: boolean;
}

const ShopResults: React.FC<ShopResultsProps> = ({ variables, isLastPage }) => {
  const { currentCollection, shopVariables, setShopVariables, setScrollPosition } = useShopContext();

  const [filters] = useQueryStates({
    productType: parseAsArrayOf(parseAsString),
    size: parseAsArrayOf(parseAsString),
    color: parseAsArrayOf(parseAsString),
    availability: parseAsArrayOf(parseAsString),
  });

  const filtersInput = getFilters(filters);
  const [{ data, fetching }] = useQuery({
    query: GET_COLLECTION,
    variables: {
      collectionHandle: currentCollection,
      filters: filtersInput,
      ...variables,
    },
  });
  const shopResults = data?.collection?.products;

  useInfiniteScroll(
    () => setShopVariables([...shopVariables, { after: shopResults?.pageInfo.endCursor ?? "" }]),
    fetching,
    !!shopResults?.pageInfo.hasNextPage,
    isLastPage
  );

  if (fetching || !shopResults) {
    return <Loader />;
  }

  return <ShopProducts products={shopResults.nodes} onLinkClick={() => setScrollPosition(window.scrollY)} />;
};

interface ProductsProps {
  collectionHandle: string;
  productCount?: number;
}

export const Products: React.FC<ProductsProps> = ({ collectionHandle, productCount }) => {
  const t = useTranslations("metadata");
  const {
    currentCollection,
    shopVariables,
    setShopVariables,
    setCurrentCollection,
    scrollPosition,
    setScrollPosition,
  } = useShopContext();

  useEffect(() => {
    if (currentCollection !== collectionHandle) {
      setShopVariables([{ after: undefined }]);
      setScrollPosition(0);
      setCurrentCollection(collectionHandle);
    } else {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: "smooth" });
      }, 100);
    }
  }, [
    currentCollection,
    collectionHandle,
    setShopVariables,
    setCurrentCollection,
    setScrollPosition,
    scrollPosition,
  ]);

  const countText = productCount === 1 ? t("shop.product") : t("shop.products");

  return (
    <div className={styles["products-container"]}>
      {productCount && (
        <p className={styles["product-count"]}>
          1-{Math.min(shopVariables.length * 32, productCount)} of {productCount} {countText}
        </p>
      )}
      <div className={styles["products"]}>
        {shopVariables.map((variables, index) => (
          <Suspense key={index} fallback={<Loader />}>
            <ShopResults variables={variables} isLastPage={shopVariables.length - 1 === index} />
          </Suspense>
        ))}
      </div>
    </div>
  );
};
