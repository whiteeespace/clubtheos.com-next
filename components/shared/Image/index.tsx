"use client";

import { Image as CoreImage, ImageProps } from "@whiteeespace/core";
import { HTMLProps } from "react";

const Image: React.FC<ImageProps & HTMLProps<HTMLImageElement>> = (props) => {
  return <CoreImage {...props} />;
};

export default Image;
