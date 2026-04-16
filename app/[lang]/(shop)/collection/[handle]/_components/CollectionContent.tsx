"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { CollectionPageData } from "@/lib/data/get-collection-page-data";
import Image from "@theos/Image";
import Price from "@theos/Price";
import { Link } from "@utils/navigation";

import styles from "../styles.module.scss";

/** Match `Item` / shop grid — same blur + srcset behavior as product tiles */
const BLUR_SIZE = 30;
const SIZES_SHOP_ITEM = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";
const SIZES_COLLECTION_HERO = "(max-width: 600px) 100vw, 600px";
const SIZES_GALLERY_CELL = "(max-width: 600px) 50vw, 300px";

interface Props {
  collection: CollectionPageData;
}

export const CollectionContent: React.FC<Props> = ({ collection }) => {
  const [playSound, setPlaySound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const userPausedRef = useRef(false);

  const hasVideo = collection.videoSources.length > 0;
  const hasImages = collection.images.length > 0;
  const collectionImage = collection.collectionImage;

  const carouselProducts = useMemo(
    () => collection.products.filter((p) => p.featuredImage?.url),
    [collection.products]
  );
  const hasProductCarousel = carouselProducts.length > 0;

  const videoSourcesKey = collection.videoSources.map((s) => s.url).join("|");

  const scrollCarousel = useCallback((direction: 1 | -1) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  }, []);

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

      {/* Product carousel */}
      {hasProductCarousel && (
        <div
          className={styles.productCarousel}
          role="region"
          aria-roledescription="carousel"
          aria-label="Products in this collection"
        >
          <div ref={carouselRef} className={styles.productCarouselTrack}>
            {carouselProducts.map((product) => {
              const img = product.featuredImage!;
              return (
                <Link
                  key={product.handle}
                  href={`/product/${product.handle}`}
                  className={styles.productCarouselSlide}
                  style={{ touchAction: "manipulation" }}
                >
                  <div className={styles.productCarouselImageWrap}>
                    <Image
                      key={img.url as string}
                      src={img.url as string}
                      alt={img.altText ?? product.title}
                      aspectRatio="3/4"
                      blurSize={BLUR_SIZE}
                      sizes={SIZES_SHOP_ITEM}
                      className={styles.productCarouselImage}
                    />
                  </div>
                  <div className={styles.productCarouselCaption}>
                    <span className={styles.productCarouselTitle}>{product.title}</span>
                    <span className={styles.productCarouselPrice}>
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
          {carouselProducts.length > 1 && (
            <>
              <button
                type="button"
                className={styles.productCarouselNav}
                aria-label="Previous product"
                onClick={() => scrollCarousel(-1)}
              >
                <CaretLeft size={20} weight="bold" aria-hidden />
              </button>
              <button
                type="button"
                className={`${styles.productCarouselNav} ${styles.productCarouselNavNext}`}
                aria-label="Next product"
                onClick={() => scrollCarousel(1)}
              >
                <CaretRight size={20} weight="bold" aria-hidden />
              </button>
            </>
          )}
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
