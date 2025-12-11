"use client";

import { CartLineProvider, useCart } from "@shopify/hydrogen-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { useShopContext } from "@/lib/context/shop-context";
import Button from "@theos/Button";
import { Link } from "@utils/navigation";

import styles from "../styles.module.scss";

import CartItem from "./CartItem";

interface CartProps {
  freeShipping: string;
}

const Cart: React.FC<CartProps> = ({ freeShipping }) => {
  const t = useTranslations("metadata");
  const { lines, totalQuantity, checkoutUrl } = useCart();
  const { releaseCollectionHandle } = useShopContext();

  const continueShoppingHref = releaseCollectionHandle ? `/collection/${releaseCollectionHandle}` : "/shop";

  if (!totalQuantity) {
    return (
      <div className={styles["empty-container"]}>
        <p>{t("cart.empty")}</p>
        <Link href={continueShoppingHref}>
          <Button className={styles.button} variant="primary">
            {t("cart.continue_shopping")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={styles["content-container"]}
      >
        <div className={styles["left-container"]}>
          <div className={styles.cart}>
            {lines?.map((line) => (
              <CartLineProvider key={line?.id} line={line!}>
                <CartItem />
              </CartLineProvider>
            ))}
          </div>
        </div>
        {checkoutUrl && (
          <div className={styles["right-container"]}>
            <div className={styles["button-container"]}>
              <Link href={checkoutUrl} target="_blank">
                <Button className={styles.button} variant="primary">
                  {t("cart.checkout")}
                </Button>
              </Link>

              <p>{freeShipping}</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Cart;
