"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useCallback } from "react";

import styles from "../styles.module.scss";

interface FadeContainerProps extends PropsWithChildren {
  redirectPath: string;
}

const FadeContainer: React.FC<FadeContainerProps> = ({ redirectPath, children }) => {
  const controls = useAnimationControls();
  const router = useRouter();

  const onClick = useCallback(async () => {
    await controls.start({ opacity: 0 });
    router.push(redirectPath);
  }, [controls, redirectPath, router]);

  return (
    <motion.div
      role="button"
      animate={controls}
      transition={{ duration: 1 }}
      onClick={onClick}
      className={styles["container"]}
    >
      {children}
    </motion.div>
  );
};

export default FadeContainer;
