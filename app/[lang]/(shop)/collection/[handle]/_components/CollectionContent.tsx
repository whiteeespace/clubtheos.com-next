"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import Image from "@/components/shared/Image";
import type { CollectionPageData } from "@/lib/data/get-collection-page-data";
import Button from "@theos/Button";

import styles from "../styles.module.scss";

interface Props {
  collection: CollectionPageData;
}

export const CollectionContent: React.FC<Props> = ({ collection }) => {
  const t = useTranslations("navigation");
  const [playSound, setPlaySound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const userPausedRef = useRef(false);

  const hasVideo = collection.videoSources.length > 0;
  const hasImages = collection.images.length > 0;
  const hasProductImages = collection.productImages.length > 0;
  const collectionImage = collection.collectionImage;

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
            src={collectionImage.url}
            alt={collectionImage.altText ?? collection.title}
            width={collectionImage.width ?? 1200}
            height={collectionImage.height ?? 800}
            aspectRatio={`${collectionImage.width ?? 1200} / ${collectionImage.height ?? 800}`}
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

      {/* Product Images */}
      {hasProductImages && (
        <div className={styles.productImagesSection}>
          <div className={styles.productImagesGrid}>
            {collection.productImages.map((image, index) => (
              <div key={image.url} className={styles.productImageItem}>
                <Image
                  src={image.url}
                  alt={image.altText ?? `${collection.title} product ${index + 1}`}
                  width={image.width ?? 800}
                  height={image.height ?? 800}
                  className={styles.productImage}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shop Now Button */}
      {collection.firstProductHandle && (
        <div className={styles.buyNowButton}>
          <Link href={`/product/${collection.firstProductHandle}`}>
            <Button variant="primary">{t("shop_now")}</Button>
          </Link>
        </div>
      )}

      {/* Gallery */}
      {hasImages && (
        <div className={styles.gallery}>
          {collection.images.map((image, index) => (
            <div key={image.url} className={styles.galleryItem}>
              <Image
                src={image.url}
                alt={image.altText ?? `${collection.title} image ${index + 1}`}
                width={image.width ?? 800}
                height={image.height ?? 600}
                className={styles.galleryImage}
              />
            </div>
          ))}
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
