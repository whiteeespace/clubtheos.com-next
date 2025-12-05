"use client";

import { CheckIcon } from "@phosphor-icons/react";
import {
  AddToCartButton,
  flattenConnection,
  useProduct,
  useCart,
  getClientBrowserParameters,
  sendShopifyAnalytics,
  AnalyticsEventName,
} from "@shopify/hydrogen-react";
import classNames from "classnames";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Condition } from "@components/Condition";
import { SizeGuide } from "@components/SizeGuide";
import { Accordion, AccordionGroup } from "@theos/Accordion";
import Button from "@theos/Button";
import Image from "@theos/Image";
import Select, { SelectItem } from "@theos/Select";
import { getVariantsSizeChart, ProductVariantWithSizeChart } from "@utils/utils/get-variant-size-chart";

import styles from "../styles.module.scss";

import { ProductInfo } from "./ProductInfo";

interface ProductViewProps {
  freeShipping: string;
  sizeGuide?: string;
  condition?: string;
}

export const ProductView: React.FC<ProductViewProps> = ({ freeShipping, sizeGuide, condition }) => {
  const t = useTranslations("metadata");
  const pathname = usePathname();

  const { product, setSelectedVariant, selectedVariant } = useProduct();
  const { lines, id: cartId } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState(
    product?.availableForSale ? t("product.add_to_cart") : t("product.sold_out")
  );

  const variants = useMemo(
    () => flattenConnection(product?.variants).map((variant) => variant),
    [product?.variants]
  );
  const productImages = flattenConnection(product?.images);
  const sizeChart = getVariantsSizeChart(variants as ProductVariantWithSizeChart[]);

  const variantsOptions = useMemo(
    () =>
      variants.map((variant) => ({
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
      const shopId = process.env.NEXT_PUBLIC_SHOP_ID;
      if (cartId && shopId) {
        try {
          const browserParams = getClientBrowserParameters();
          void sendShopifyAnalytics({
            eventName: AnalyticsEventName.ADD_TO_CART,
            payload: {
              ...browserParams,
              cartId,
              shopId: `gid://shopify/Shop/${shopId}`,
              currency: "CAD",
              hasUserConsent: true,
            },
          });
        } catch {
          // Analytics failure should not block UX
        }
      }
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
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}
        className={styles["left-container"]}
      >
        <ProductInfo className={styles["product-info--desktop"]} />
        <AccordionGroup className={styles.accordions}>
          <Accordion
            id="description"
            title="Product details"
            content={
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{
                  __html: product.descriptionHtml ?? "",
                }}
              />
            }
          />
          <Accordion id="condition" title="Condition" content={<Condition value={condition} />} />
        </AccordionGroup>
        <SizeGuide sizeGuide={sizeGuide} sizeChart={sizeChart} className={styles["size-guide--mobile"]} />
        <p className={classNames(styles["free-shipping--mobile"], styles["free-shipping"])}>{freeShipping}</p>
      </motion.div>
      <motion.div
        className={styles["images-container"]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.25 }}
      >
        {productImages?.map((image) => (
          <Image
            key={image?.url}
            src={image?.url}
            alt="product image"
            className={styles.image}
            blurSize={50}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
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
          <SizeGuide sizeGuide={sizeGuide} sizeChart={sizeChart} className={styles["size-guide--desktop"]} />
          <Select
            label="Size"
            disabled={!product.availableForSale}
            value={selectedVariant?.id}
            onValueChange={singleSelectSetValue}
            placeholder={t("product.select_size")}
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
              className={styles.button}
              onClick={() => onAddToCart()}
              disabled={isLoading || !product.availableForSale}
            >
              {buttonText === "added" ? (
                <div className={styles.added}>
                  <CheckIcon size={18} /> {t("product.added_to_cart")}
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
