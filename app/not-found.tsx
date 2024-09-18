"use client";

import Link from "next/link";

import Button from "@theos/Button";

import styles from "./styles.module.scss";

export default function NotFound() {
  return (
    <html lang="en">
      <body className={styles["error-container"]}>
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link href="/">
          <Button variant="primary">Return Home</Button>
        </Link>
      </body>
    </html>
  );
}
