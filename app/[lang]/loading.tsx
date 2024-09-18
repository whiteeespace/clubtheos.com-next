import React from "react";

import PageLoader from "@/components/custom/PageLoader";

interface LoadingProps {
  // Add any props you need for the loading component
}

const Loading: React.FC<LoadingProps> = () => {
  return <PageLoader />;
};

export default Loading;
