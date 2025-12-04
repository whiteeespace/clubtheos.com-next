"use client";

import classNames from "classnames";
import { motion } from "framer-motion";
import { PartialDeep } from "type-fest";

import { Product } from "@/gql/graphql";
import Image from "@theos/Image";
import Price from "@theos/Price";

import styles from "./styles.module.scss";

interface Props {
  product: PartialDeep<Product, { recurseIntoArrays: true }>;
  className?: string;
}

const Item: React.FC<Props> = ({ product, className }) => {
  const title = product.title;
  const availableForSale = product.availableForSale;
  const src = product.featuredImage?.url as string | undefined;

  return (
    <motion.div className={classNames(styles["item-container"], className)} transition={{ duration: 0.5 }}>
      <Image
        key={src}
        src={src}
        blurSize={30}
        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        className={classNames(styles.image, {
          [styles["image--not-available"]]: !availableForSale,
        })}
        alt={title ?? "product"}
      />
      <div className={styles["info-container"]}>
        <p className={styles.title}>{title}</p>
        <div className={styles.price}>
          {availableForSale && product.priceRange?.maxVariantPrice ? (
            <Price
              price={product.priceRange?.maxVariantPrice}
              comparedAtPrice={product.compareAtPriceRange?.maxVariantPrice}
            />
          ) : (
            "SOLD OUT"
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Item;
