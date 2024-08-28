"use client";

import { UrqlProvider, WhiteeeShopifyProvider } from "@whiteeespace/core";
import classNames from "classnames";
import { PropsWithChildren } from "react";

import styles from "./styles.module.scss";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <UrqlProvider>
      <WhiteeeShopifyProvider countryCode="CA" languageCode="EN">
        <div className={classNames(styles["container"])}>{children}</div>
      </WhiteeeShopifyProvider>
    </UrqlProvider>
  );
};
export default Layout;
