"use client";

import { ImageMetaobject } from "@whiteeespace/core/utils";
import { motion } from "framer-motion";
import React from "react";

import styles from "../styles.module.scss";

interface ShopImageProps {
  shopImage: ImageMetaobject | null;
}

const ShopImage: React.FC<ShopImageProps> = ({ shopImage }) => {
  if (!shopImage || !shopImage.image?.url) {
    return null;
  }

  return (
    <div className={styles["store-image"]}>
      <motion.img
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        src={`${shopImage.image.url}&width=1200`}
        alt="shop-details"
      />
    </div>
  );
};

export default ShopImage;
