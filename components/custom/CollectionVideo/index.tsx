"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { useWindowView } from "@/lib/hooks/use-window-view";
import Button from "@theos/Button";

import styles from "./styles.module.scss";

interface CollectionVideoProps {
  videoSourcesMobile: { url: string; mimeType: string }[];
  videoSourcesDesktop: { url: string; mimeType: string }[];
}

const CollectionVideo: React.FC<CollectionVideoProps> = ({ videoSourcesMobile, videoSourcesDesktop }) => {
  const [playSound, setPlaySound] = useState(false);
  const { isTabletOrMobile } = useWindowView();

  const mainVideoSources = isTabletOrMobile ? videoSourcesMobile : videoSourcesDesktop;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className={styles["video-container"]}
    >
      <Button
        variant="tertiary"
        onClick={() => setPlaySound((curr) => !curr)}
        className={styles["sound-button"]}
      >
        {playSound ? "MUTE" : "UNMUTE"}
      </Button>
      <video id="videoplayer" muted={!playSound} autoPlay playsInline loop className={styles.video}>
        {mainVideoSources.map((source) => (
          <source key={source.url} src={source.url} type={source.mimeType} />
        ))}
      </video>
    </motion.div>
  );
};

export default CollectionVideo;
