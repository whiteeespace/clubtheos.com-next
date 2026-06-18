"use client";

import classNames from "classnames";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { CollectionPageData } from "@/lib/data/get-collection-page-data";
import Image from "@theos/Image";
import Price from "@theos/Price";
import { Link } from "@utils/navigation";

import styles from "../styles.module.scss";

/** Match `Item` / shop grid — same blur + srcset behavior as product tiles */
const BLUR_SIZE = 30;
const SIZES_COLLECTION_HERO = "(max-width: 600px) 100vw, 600px";
const SIZES_GALLERY_CELL = "(max-width: 600px) 50vw, 300px";
/** Single-product collections render one larger, centered tile. */
const SIZES_SINGLE_CELL = "(max-width: 600px) 100vw, 360px";

interface Props {
  collection: CollectionPageData;
}

export const CollectionContent: React.FC<Props> = ({ collection }) => {
  const [playSound, setPlaySound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const userPausedRef = useRef(false);

  const hasVideo = collection.videoSources.length > 0;
  const hasImages = collection.images.length > 0;
  const collectionImage = collection.collectionImage;

  const gridProducts = useMemo(
    () => collection.products.filter((p) => p.featuredImage?.url),
    [collection.products]
  );
  const hasProductGrid = gridProducts.length > 0;
  const isSingleProduct = gridProducts.length === 1;

  const videoSourcesKey = collection.videoSources.map((s) => s.url).join("|");

  const tryPlay = useCallback(() => {
    const el = videoRef.current;
    if (!el || userPausedRef.current) return;
    void el.play().catch(() => {
      /* autoplay blocked or missing codec — user can use Play */
    });
  }, []);

  useEffect(() => {
    userPausedRef.current = false;
  }, [videoSourcesKey]);

  useEffect(() => {
    if (!hasVideo) return;
    tryPlay();
  }, [hasVideo, videoSourcesKey, tryPlay]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !hasVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) tryPlay();
      },
      { root: null, threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasVideo, videoSourcesKey, tryPlay]);

  const togglePlayPause = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      userPausedRef.current = false;
      void el.play().catch(() => {
        console.log("autoplay blocked or missing codec — user can use Play");
      });
    } else {
      userPausedRef.current = true;
      el.pause();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.container}
    >
      {/* Collection Hero Image */}
      {collectionImage ? (
        <div className={styles.heroImageWrapper}>
          <Image
            key={collectionImage.url}
            src={collectionImage.url}
            alt={collectionImage.altText ?? collection.title}
            aspectRatio={`${collectionImage.width ?? 1200} / ${collectionImage.height ?? 800}`}
            blurSize={BLUR_SIZE}
            sizes={SIZES_COLLECTION_HERO}
            className={styles.heroImage}
          />
        </div>
      ) : (
        <div className={styles.topSection}>
          <h1 className={styles.title}>{collection.title}</h1>
        </div>
      )}

      {/* Description */}
      {collection.descriptionHtml && (
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }}
        />
      )}

      {/* Product grid */}
      {hasProductGrid && (
        <div
          className={classNames(styles.productGrid, {
            [styles["productGrid--single"]]: isSingleProduct,
          })}
          role="region"
          aria-label="Products in this collection"
        >
          {gridProducts.map((product) => {
            const img = product.featuredImage!;
            return (
              <Link
                key={product.handle}
                href={`/product/${product.handle}`}
                className={styles.productGridItem}
              >
                <div className={styles.productGridImageWrap}>
                  <Image
                    key={img.url as string}
                    src={img.url as string}
                    alt={img.altText ?? product.title}
                    aspectRatio="3/4"
                    blurSize={BLUR_SIZE}
                    sizes={isSingleProduct ? SIZES_SINGLE_CELL : SIZES_GALLERY_CELL}
                    className={styles.productGridImage}
                  />
                </div>
                <div className={styles.productGridCaption}>
                  <span className={styles.productGridTitle}>{product.title}</span>
                  <span className={styles.productGridPrice}>
                    {product.availableForSale && product.priceRange?.maxVariantPrice ? (
                      <Price
                        price={product.priceRange.maxVariantPrice}
                        comparedAtPrice={product.compareAtPriceRange?.maxVariantPrice}
                      />
                    ) : (
                      "SOLD OUT"
                    )}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Gallery */}
      {hasImages && (
        <div className={styles.gallery}>
          {collection.images.map((image, index) => {
            const w = image.width ?? 800;
            const h = image.height ?? 600;
            return (
              <div key={image.url} className={styles.galleryItem}>
                <Image
                  key={image.url}
                  src={image.url}
                  alt={image.altText ?? `${collection.title} image ${index + 1}`}
                  aspectRatio={`${w} / ${h}`}
                  blurSize={BLUR_SIZE}
                  sizes={SIZES_GALLERY_CELL}
                  className={styles.galleryImage}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Video (at the end) */}
      {hasVideo && (
        <div className={styles.videoWrapper}>
          <div className={styles.videoContainer}>
            <video
              ref={videoRef}
              id="collection-video"
              muted={!playSound}
              autoPlay
              playsInline
              loop
              preload="auto"
              className={styles.video}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoadedData={tryPlay}
            >
              {collection.videoSources.map((source) => (
                <source key={source.url} src={source.url} type={source.mimeType} />
              ))}
            </video>
            <div className={styles.videoControls}>
              <button
                type="button"
                onClick={togglePlayPause}
                className={styles.videoControlButton}
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={() => setPlaySound((curr) => !curr)}
                className={styles.videoControlButton}
                aria-label={playSound ? "Mute video" : "Unmute video"}
              >
                {playSound ? "Mute" : "Unmute"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
