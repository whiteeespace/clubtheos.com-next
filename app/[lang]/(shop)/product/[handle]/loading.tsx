"use client";

import React, { useEffect } from "react";

import Loader from "@theos/Loader";
import { usePathname } from "@utils/navigation";

interface LoadingProps {
  // Add any props you need for the loading component
}

const Loading: React.FC<LoadingProps> = () => {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <Loader />;
};

export default Loading;
