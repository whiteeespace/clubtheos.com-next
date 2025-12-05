"use client";

import classNames from "classnames";
import { motion } from "framer-motion";

import styles from "../styles.module.scss";

export interface BlobProps {
  className?: string;
}

export const Blob: React.FC<BlobProps> = ({ className }) => {
  return (
    <motion.a
      whileHover={{ scale: 1.1 }}
      className={classNames(styles["dot-logo"], className)}
      href="https://whiteee.space"
      target="_blank"
    />
  );
};
