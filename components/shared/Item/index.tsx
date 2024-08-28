"use client";

import { ProductPrice } from "@whiteeespace/core";
import classNames from "classnames";
import { motion } from "framer-motion";

import { Product } from "@/gql/graphql";

import styles from "./styles.module.scss";

interface Props {
  product: {
    title: Product["title"];
    availableForSale: Product["availableForSale"];
    featuredImage?: {
      url: string;
    } | null;
    priceRange: Product["priceRange"];
  };
  className?: string;
}

const Item: React.FC<Props> = ({ product, className }) => {
  const { title, featuredImage, availableForSale } = product;
  const src = featuredImage?.url;

  return (
    <motion.div className={classNames(styles["item-container"], className)} transition={{ duration: 0.5 }}>
      <motion.img
        transition={{ duration: 1 }}
        src={`${src}&width=10`}
        className={classNames(styles["image"], "lazyload", "lazyloaded", {
          [styles["image--not-available"]]: !availableForSale,
        })}
        alt="taikataikataika"
        data-sizes="auto"
        data-srcset={`${src}&width=300 300w,
          ${src}&width=600 600w,
          ${src}&width=800 800w`}
      />
      <div className={styles["info-container"]}>
        <p className={styles["title"]}>{title}</p>
        <ProductPrice data={product} />
      </div>
    </motion.div>
  );
};

export default Item;
