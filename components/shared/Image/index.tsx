"use client";

import { Image as ShopifyImage } from "@shopify/hydrogen-react";
import classNames from "classnames";
import { ComponentProps, useState } from "react";

import styles from "./styles.module.scss";

type ShopifyImageProps = ComponentProps<typeof ShopifyImage>;

export interface ImageProps extends ShopifyImageProps {
  /** Width of the blur placeholder in pixels (default: 30) */
  blurSize?: number;
  /** Aspect ratio for the placeholder (e.g., "3/4", "1/1", "16/9"). Defaults to "3/4" for product images */
  aspectRatio?: string;
  /**
   * When true, the wrapper is absolutely positioned to fill the parent (parent must be `position: relative`).
   * Use instead of `aspectRatio` for layouts that previously used `next/image` `fill`.
   */
  fill?: boolean;
}

/**
 * Generate a low-quality placeholder URL from a Shopify CDN image URL
 */
function getPlaceholderUrl(src: string | undefined, width: number): string | undefined {
  if (!src) return undefined;

  // Shopify CDN URLs use query params for transformations
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}width=${width}`;
}

const Image: React.FC<ImageProps> = ({
  src,
  data,
  blurSize = 30,
  aspectRatio = "3/4",
  fill = false,
  className,
  onLoad,
  ...restOfProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // String URL for Shopify CDN ops (React 19 types `src` as string | Blob)
  const stringUrl = typeof src === "string" ? src : data?.url;
  const placeholderSrc = getPlaceholderUrl(stringUrl, blurSize);

  if (!src && !data?.url) {
    return null;
  }

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  return (
    <div
      className={classNames(styles.wrapper, fill && styles.wrapperFill, className)}
      style={fill ? undefined : { aspectRatio }}
    >
      {/* Low quality placeholder - loads instantly */}
      {placeholderSrc && (
        // eslint-disable-next-line @next/next/no-img-element -- Intentional: tiny blur placeholder doesn't benefit from next/image optimization
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className={classNames(styles.placeholder, { [styles.hidden]: isLoaded })}
        />
      )}

      {/* Full quality Shopify Image with automatic srcset */}
      <ShopifyImage
        src={src}
        data={data}
        className={classNames(styles.image, { [styles.loaded]: isLoaded })}
        onLoad={handleLoad}
        {...restOfProps}
      />
    </div>
  );
};

export default Image;
