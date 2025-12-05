import { useCartLine, useCart } from "@shopify/hydrogen-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React from "react";

import { MoneyV2 } from "@/gql/graphql";
import Button from "@theos/Button";
import Image from "@theos/Image";
import Price from "@theos/Price";
import { Link } from "@utils/navigation";

import styles from "../styles.module.scss";

const CartItem: React.FC = () => {
  const t = useTranslations("metadata");
  const { linesRemove } = useCart();
  const item = useCartLine();

  return (
    <motion.div
      className={styles["item-container"]}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Link href={`/product/${item.merchandise?.product?.handle}`} className={styles["product-info"]}>
        {item.merchandise?.image?.url && (
          <div className={styles["image-container"]}>
            <Image
              src={item.merchandise?.image?.url}
              className={styles.image}
              blurSize={30}
              alt="cart-item"
            />
          </div>
        )}

        <div>
          <p>{item.merchandise?.product?.title}</p>
          <p>{item.merchandise?.title}</p>
        </div>
      </Link>

      <div className={styles.price}>
        <div>
          {item.merchandise?.price && (
            <Price
              price={item.merchandise.price as Partial<MoneyV2>}
              comparedAtPrice={item.merchandise.compareAtPrice as Partial<MoneyV2>}
            />
          )}
        </div>
        <Button variant="link" onClick={() => linesRemove(item.id ? [item.id] : [])}>
          {t("cart.remove")}
        </Button>
      </div>
    </motion.div>
  );
};
export default CartItem;
