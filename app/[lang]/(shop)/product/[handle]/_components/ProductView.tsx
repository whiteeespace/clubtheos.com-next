"use client";

import { Check } from "@phosphor-icons/react/dist/ssr";
import {
  Button,
  Image,
  AddToCartButton,
  flattenConnection,
  useProduct,
  useShopifyAnalytics,
  useCart,
} from "@whiteeespace/core";
import classNames from "classnames";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import { Accordion, AccordionGroup } from "@theos/Accordion";
import Select, { SelectItem } from "@theos/Select";

import { ProductInfo } from "./ProductInfo";
import styles from "../styles.module.scss";

interface ProductViewProps {
  freeShipping: string;
  sizeGuide?: string;
}

export const ProductView: React.FC<ProductViewProps> = ({ freeShipping, sizeGuide }) => {
  const t = useTranslations("metadata");
  const pathname = usePathname();

  const { product, setSelectedVariant, selectedVariant } = useProduct();
  const { lines, id: cartId } = useCart();
  const { sendAddToCart } = useShopifyAnalytics({
    shopId: `${process.env.NEXT_PUBLIC_SHOP_ID}`,
    currency: "CAD",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState(
    product?.availableForSale ? t("product.add_to_cart") : t("product.sold_out")
  );

  const variants = flattenConnection(product?.variants);
  const productImages = flattenConnection(product?.images);

  const variantsOptions = useMemo(
    () =>
      variants?.map((variant) => ({
        label: variant?.title ?? "",
        value: variant?.id ?? "",
        disabled: !variant?.quantityAvailable,
        quantityAvailable: variant?.quantityAvailable,
      })),
    [variants]
  );

  const singleSelectSetValue = useCallback(
    (id: string) => {
      const newSelectedVariant = variants.find((variant) => variant?.id === id);
      if (newSelectedVariant) {
        setSelectedVariant(newSelectedVariant);
      }
    },
    [setSelectedVariant, variants]
  );

  const onAddToCart = () => {
    setIsLoading(true);

    const variantQuantity = variantsOptions?.find(
      (variant) => variant.value === selectedVariant?.id
    )?.quantityAvailable;
    const currentQuantity = lines?.find((line) => line?.merchandise?.id === selectedVariant?.id)?.quantity;

    if (!variantQuantity || (currentQuantity && variantQuantity <= currentQuantity)) {
      setButtonText("none left");
    } else {
      setButtonText("added");
      if (cartId) sendAddToCart({ cartId });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!product) {
    return <></>;
  }

  return (
    <div className={styles["container"]}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}
        className={styles["left-container"]}
      >
        <ProductInfo className={styles["product-info--desktop"]} />
        <AccordionGroup className={styles["accordions"]}>
          <Accordion
            id="description"
            title="Product details"
            content={
              <div
                className={styles["description"]}
                dangerouslySetInnerHTML={{
                  __html: product.descriptionHtml ?? "",
                }}
              />
            }
          />
          <Accordion
            id="size-guide"
            title="Size guide"
            content={sizeGuide
              ?.trim()
              .split("\n")
              .map((text, id) => (
                <Fragment key={`text-${id}`}>
                  {text}
                  <br />
                </Fragment>
              ))}
          />
        </AccordionGroup>

        <p className={classNames(styles["free-shipping--mobile"], styles["free-shipping"])}>{freeShipping}</p>
      </motion.div>
      <motion.div
        className={styles["images-container"]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.25 }}
      >
        {productImages?.map((image) => (
          <Image key={image?.url} src={image?.url} alt={"product image"} className={styles["image"]} />
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}
        className={styles["right-container"]}
      >
        <ProductInfo className={styles["product-info--mobile"]} />
        <div className={styles["action-container"]}>
          <Select
            label="Size"
            disabled={!product.availableForSale}
            value={selectedVariant?.id}
            onValueChange={singleSelectSetValue}
            placeholder={t("product.select_size")}
            defaultValue={selectedVariant?.id}
          >
            {variantsOptions?.map((variant) => (
              <SelectItem key={variant.value} value={variant.value}>
                {variant.label}
              </SelectItem>
            ))}
          </Select>
          <div className={styles["button-container"]}>
            <AddToCartButton // @ts-expect-error typing issues with shopify
              as={Button}
              className={styles["button"]}
              onClick={() => onAddToCart()}
              disabled={isLoading || !product.availableForSale}
            >
              {buttonText === "added" ? (
                <div className={styles["added"]}>
                  <Check size={18} /> {t("product.added_to_cart")}
                </div>
              ) : (
                buttonText
              )}
            </AddToCartButton>
            <p className={classNames(styles["free-shipping--desktop"], styles["free-shipping"])}>
              {freeShipping}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
