import React from "react";

import Loader from "@theos/Loader";

interface LoadingProps {
  // Add any props you need for the loading component
}

const Loading: React.FC<LoadingProps> = () => {
  return <Loader />;
};

export default Loading;
