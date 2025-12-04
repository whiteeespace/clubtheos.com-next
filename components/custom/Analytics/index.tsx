"use client";

import {
  sendShopifyAnalytics,
  getClientBrowserParameters,
  AnalyticsEventName,
  AnalyticsPageType,
  useShopifyCookies,
} from "@shopify/hydrogen-react";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

// Get shop ID as GID format - Shopify expects "gid://shopify/Shop/ID"
const SHOP_ID = process.env.NEXT_PUBLIC_SHOP_ID;
const SHOP_GID = SHOP_ID ? `gid://shopify/Shop/${SHOP_ID}` : null;

const AnalyticsComponent: React.FC = () => {
  const pathname = usePathname();
  useShopifyCookies({ domain: "clubtheos.com" });

  useEffect(() => {
    if (!SHOP_GID) {
      console.warn("[Analytics] NEXT_PUBLIC_SHOP_ID is not set, skipping analytics");
      return;
    }

    const sendPageView = () => {
      try {
        const browserParams = getClientBrowserParameters();
        sendShopifyAnalytics({
          eventName: AnalyticsEventName.PAGE_VIEW,
          payload: {
            ...browserParams,
            shopId: SHOP_GID,
            currency: "CAD",
            pageType: AnalyticsPageType.page,
            hasUserConsent: true,
          },
        });
      } catch (error) {
        // Analytics should not break the app
        console.warn("[Analytics] Failed to send page view:", error);
      }
    };

    sendPageView();
  }, [pathname]);

  return null;
};

export default AnalyticsComponent;
