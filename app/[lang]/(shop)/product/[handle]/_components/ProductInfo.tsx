import { useProduct } from "@whiteeespace/core";
import classNames from "classnames";
import React from "react";

import { MoneyV2 } from "@/gql/graphql";
import Price from "@theos/Price";

import styles from "../styles.module.scss";

interface ProductInfoProps {
  className?: string;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ className }) => {
  const { product } = useProduct();

  if (!product) {
    return null;
  }

  return (
    <div className={classNames(styles["product-info"], className)}>
      <h1 className={styles["title"]}>{product.title}</h1>
      <div className={styles["price"]}>
        {product.priceRange?.maxVariantPrice && (
          <Price
            price={product.priceRange.maxVariantPrice as Partial<MoneyV2>}
            comparedAtPrice={product.compareAtPriceRange?.maxVariantPrice as Partial<MoneyV2>}
            noWrap
          />
        )}
      </div>
    </div>
  );
};
