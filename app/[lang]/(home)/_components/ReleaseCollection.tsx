"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { NewsletterSignup } from "@/components/custom/NewsletterSignup";
import type { ReleaseCollection as ReleaseCollectionType } from "@/lib/data/get-release-data";

import styles from "../styles.module.scss";

interface Props {
  collection: ReleaseCollectionType;
  expectedPassword?: string | null;
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
};

export const ReleaseCollection: React.FC<Props> = ({ collection }) => {
  const [playSound, setPlaySound] = useState(false);

  const hasVideo = collection.videoSources.length > 0;
  const hasImages = collection.images.length > 0;

  return (
    <motion.div className={styles["release-collection-container"]} {...fadeIn}>
      {/* Title */}
      <div className={styles.topSection}>
        <h1 className={styles.title}>{collection.title}</h1>

        {/* Video (Square Format) */}
        {hasVideo && (
          <div className={styles["video-wrapper"]}>
            <div className={styles["video-container"]}>
              <video
                id="collection-video"
                muted={!playSound}
                autoPlay
                playsInline
                loop
                className={styles.video}
              >
                {collection.videoSources.map((source) => (
                  <source key={source.url} src={source.url} type={source.mimeType} />
                ))}
              </video>
              <button
                type="button"
                onClick={() => setPlaySound((curr) => !curr)}
                className={styles["sound-button"]}
                aria-label={playSound ? "Mute video" : "Unmute video"}
              >
                {playSound ? "Mute" : "Unmute"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className={styles.descriptionContainer}>
        {collection.descriptionHtml && (
          <div
            className={styles.description}
             
            dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }}
          />
        )}

        {/* Release Message */}
        {collection.releaseMessage && <p className={styles.releaseMessage}>{collection.releaseMessage}</p>}
      </div>

      {/* Gallery */}
      {hasImages && (
        <div className={styles.gallery}>
          {collection.images.map((image, index) => (
            <div key={image.url} className={styles["gallery-item"]}>
              <Image
                src={image.url}
                alt={image.altText ?? `${collection.title} image ${index + 1}`}
                width={image.width ?? 800}
                height={image.height ?? 600}
                className={styles["gallery-image"]}
              />
            </div>
          ))}
        </div>
      )}

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </motion.div>
  );
};
