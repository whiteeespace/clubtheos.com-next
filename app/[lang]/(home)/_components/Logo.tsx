"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

import styles from "../styles.module.scss";

interface LogoProps {
  src: string;
  alt: string;
}

const Logo: React.FC<LogoProps> = ({ src, alt }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className={styles["logo"]}
    >
      <Image src={src} placeholder="blur" blurDataURL={`${src}?w=100&q=10`} alt={alt} fill={true} />
    </motion.div>
  );
};

export default Logo;
