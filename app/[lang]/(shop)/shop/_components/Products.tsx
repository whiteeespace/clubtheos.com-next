"use client";

import { useLocale, useTranslations } from "next-intl";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { Suspense, useEffect, useMemo, useState } from "react";

import {
  CountryCode,
  GetCollectionProductCountQuery,
  GetCollectionQuery,
  LanguageCode,
  ProductFilter,
} from "@/gql/graphql";
import { useShopifyQuery } from "@/lib/hooks/use-shopify-query";
import { ShopVariables, useShopContext } from "@components/Layout/ShopContext";
import { ShopProducts } from "@components/ShopProducts";
import Loader from "@theos/Loader";
import { getFilters, getProductCount } from "@utils/filters";
import useInfiniteScroll from "@utils/hooks/use-infinite-scroll";
import { GET_COLLECTION } from "@utils/queries/get-collection";
import { GET_COLLECTION_PRODUCT_COUNT } from "@utils/queries/get-collection-product-count";

import styles from "../styles.module.scss";

interface ShopResultsProps {
  variables: ShopVariables;
  filters: ProductFilter[];
  isLastPage: boolean;
  onEndReached: () => void;
}

const ShopResults: React.FC<ShopResultsProps> = ({ variables, isLastPage, filters, onEndReached }) => {
  const locale = useLocale();
  const { currentCollection, shopVariables, setShopVariables, setScrollPosition } = useShopContext();

  const { data, fetching } = useShopifyQuery<GetCollectionQuery>(GET_COLLECTION, {
    collectionHandle: currentCollection,
    filters,
    ...variables,
    language: locale.toUpperCase() as LanguageCode,
    country: "CA" as CountryCode,
  });
  const shopResults = data?.collection?.products;

  useInfiniteScroll(
    () => setShopVariables([...shopVariables, { after: shopResults?.pageInfo.endCursor ?? "" }]),
    fetching,
    !!shopResults?.pageInfo.hasNextPage,
    isLastPage
  );

  useEffect(() => {
    if (shopResults && !shopResults.pageInfo.hasNextPage) {
      onEndReached();
    }
  }, [isLastPage, onEndReached, shopResults]);

  if (fetching || !shopResults) {
    return null;
  }

  return <ShopProducts products={shopResults.nodes} onLinkClick={() => setScrollPosition(window.scrollY)} />;
};

interface ProductsProps {
  collectionHandle: string;
}

export const Products: React.FC<ProductsProps> = ({ collectionHandle }) => {
  const locale = useLocale();
  const t = useTranslations("metadata");
  const [showLoader, setShowLoader] = useState(true);
  const {
    currentCollection,
    shopVariables,
    setShopVariables,
    setCurrentCollection,
    scrollPosition,
    setScrollPosition,
  } = useShopContext();

  const [filters] = useQueryStates({
    productType: parseAsArrayOf(parseAsString),
    size: parseAsArrayOf(parseAsString),
    color: parseAsArrayOf(parseAsString),
    availability: parseAsArrayOf(parseAsString),
  });

  const filtersInput = useMemo(() => getFilters(filters), [filters]);

  const { data, fetching } = useShopifyQuery<GetCollectionProductCountQuery>(GET_COLLECTION_PRODUCT_COUNT, {
    collectionHandle: currentCollection,
    filters: filtersInput,
    language: locale.toUpperCase() as LanguageCode,
    country: "CA" as CountryCode,
  });

  const productCount = getProductCount(data?.collection?.products.filters);

  useEffect(() => {
    if (currentCollection !== collectionHandle) {
      setShopVariables([{ after: undefined }]);
      setScrollPosition(0);
      setCurrentCollection(collectionHandle);
    } else {
      if (scrollPosition) {
        setTimeout(() => {
          window.scrollTo({ top: scrollPosition, behavior: "smooth" });
        }, 100);
      }
    }
  }, [
    currentCollection,
    collectionHandle,
    setShopVariables,
    setCurrentCollection,
    setScrollPosition,
    scrollPosition,
  ]);

  // Create a stable string key for filters to detect changes
  const filtersKey = useMemo(() => JSON.stringify(filtersInput), [filtersInput]);

  // Reset shop variables when filters change
  useEffect(() => {
    setShowLoader(true);
    setShopVariables([{ after: undefined }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  const countText = productCount === 1 ? t("shop.product") : t("shop.products");
  const loadedProductsCount = Math.min(shopVariables.length * 32, productCount ?? 0);

  if (fetching) {
    return <Loader />;
  }

  return (
    <div className={styles["products-container"]}>
      <p className={styles["product-count"]}>
        1-{loadedProductsCount} of {productCount} {countText}
      </p>
      <div className={styles.products}>
        {shopVariables.map((variables, index) => (
          <Suspense key={index} fallback={null}>
            <ShopResults
              variables={variables}
              filters={filtersInput}
              isLastPage={shopVariables.length - 1 === index}
              onEndReached={() => setShowLoader(false)}
            />
          </Suspense>
        ))}
        {showLoader && <Loader />}
      </div>
    </div>
  );
};
