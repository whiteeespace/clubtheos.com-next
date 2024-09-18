"use client";

import { CartLineProvider, useCart } from "@whiteeespace/core";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import Button from "@theos/Button";
import { Link } from "@utils/navigation";

import CartItem from "./CartItem";
import styles from "../styles.module.scss";

interface CartProps {
  freeShipping: string;
}

const Cart: React.FC<CartProps> = ({ freeShipping }) => {
  const t = useTranslations("metadata");
  const { lines, totalQuantity, checkoutUrl } = useCart();

  if (!checkoutUrl) {
    return null;
  }

  if (!totalQuantity) {
    return (
      <div className={styles["empty-container"]}>
        <p>{t("cart.empty")}</p>
        <Link href="/shop">
          <Button className={styles["button"]} variant="primary">
            {t("cart.continue_shopping")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles["container"]}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={styles["content-container"]}
      >
        <div className={styles["left-container"]}>
          <div className={styles["cart"]}>
            {lines?.map((line) => (
              <CartLineProvider key={line?.id} line={line!}>
                <CartItem />
              </CartLineProvider>
            ))}
          </div>
        </div>
        <div className={styles["right-container"]}>
          <div className={styles["button-container"]}>
            <Link href={checkoutUrl} target="_blank">
              <Button className={styles["button"]} variant="primary">
                {t("cart.checkout")}
              </Button>
            </Link>

            <p>{freeShipping}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Cart;
