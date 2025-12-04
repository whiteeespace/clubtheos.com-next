"use client";

import { Money } from "@shopify/hydrogen-react";
import classNames from "classnames";
import React from "react";

import { MoneyV2 } from "@/gql/graphql";

import styles from "./styles.module.scss";

interface PriceProps {
  price: Partial<MoneyV2>;
  comparedAtPrice?: Partial<MoneyV2>;
  noWrap?: boolean;
}

const Price: React.FC<PriceProps> = ({ price, comparedAtPrice, noWrap }) => {
  return (
    <div className={styles["price-container"]}>
      {comparedAtPrice && comparedAtPrice.amount !== "0.0" ? (
        <div className={classNames(styles["discount-container"], { [styles["no-wrap"]]: noWrap })}>
          <Money data={price} className={styles.amount} />
          <Money data={comparedAtPrice} className={styles["discount-amount"]} />
        </div>
      ) : (
        <Money data={price} />
      )}
    </div>
  );
};

export default Price;
