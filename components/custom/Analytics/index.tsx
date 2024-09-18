"use client";

import { ShopifyAnalytics } from "@whiteeespace/core";
import { usePathname } from "next/navigation";
import React from "react";

const Analytics: React.FC = () => {
  const pathname = usePathname();
  return (
    <ShopifyAnalytics
      shopId={`${process.env.REACT_APP_SHOP_ID}`}
      currency={"CAD"}
      pathname={pathname}
      domain={"clubtheos.com"}
    />
  );
};

export default Analytics;
