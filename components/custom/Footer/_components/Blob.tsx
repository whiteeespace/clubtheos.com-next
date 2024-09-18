"use client";

import { Blob as BlobComponent } from "@whiteeespace/core";

import styles from "../styles.module.scss";

export const Blob: React.FC = () => {
  return <BlobComponent className={styles["blob"]} />;
};
