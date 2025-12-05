"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { NewsletterSignup } from "@/components/custom/NewsletterSignup";
import type { ReleaseCollection as ReleaseCollectionType } from "@/lib/data/get-release-data";

import styles from "../styles.module.scss";

interface Props {
  collection: ReleaseCollectionType;
}

export const ReleaseCollection: React.FC<Props> = ({ collection }) => {
  const [playSound, setPlaySound] = useState(false);

  const hasVideo = collection.videoSources.length > 0;
  const hasImages = collection.images.length > 0;

  return (
    <div className={styles["release-collection-container"]}>
      {/* Title */}
      <div className={styles.topSection}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.title}
        >
          {collection.title}
        </motion.h1>

        {/* Video (Square Format) */}
        {hasVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={styles["video-wrapper"]}
          >
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
          </motion.div>
        )}
      </div>

      {/* Description */}
      {collection.description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={styles.description}
        >
          {collection.description}
        </motion.p>
      )}

      {/* Gallery */}
      {hasImages && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className={styles.gallery}
        >
          {collection.images.map((image, index) => (
            <motion.div
              key={image.url}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 + index * 0.08 }}
              className={styles["gallery-item"]}
            >
              <Image
                src={image.url}
                alt={image.altText ?? `${collection.title} image ${index + 1}`}
                width={image.width ?? 800}
                height={image.height ?? 600}
                className={styles["gallery-image"]}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </div>
  );
};
