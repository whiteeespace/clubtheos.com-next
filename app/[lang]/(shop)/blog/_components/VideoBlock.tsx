"use client";

import { LinkSimpleHorizontal } from "@phosphor-icons/react/dist/ssr";
import classNames from "classnames";
import { useInView } from "framer-motion";
import React, { useCallback, useEffect, useRef } from "react";

import Button from "@theos/Button";

import styles from "../styles.module.scss";

interface UserActivation {
  hasBeenActive: boolean;
}

interface VideoBlockProps {
  poster?: string;
  link?: string;
  sources?: {
    url: string;
    mimeType: string;
  }[];
}

export const VideoBlock: React.FC<VideoBlockProps> = ({ poster, link, sources }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref);

  const togglePlayPause = useCallback(async () => {
    const video = ref.current;
    if (video) {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    }
  }, []);

  useEffect(() => {
    const toggleVideo = async () => {
      const video = ref.current;
      const userInteracted =
        "userActivation" in navigator && (navigator.userActivation as UserActivation).hasBeenActive;
      if (userInteracted && isInView && video?.paused) {
        await video.play();
      } else if (!isInView && !video?.paused) {
        video?.pause();
      }
    };

    toggleVideo();
  }, [isInView]);

  return (
    <div className={styles["video-container"]}>
      {link && (
        <Button
          variant="tertiary"
          onClick={() => window.open(link, "_blank")}
          className={styles["link-button"]}
        >
          <LinkSimpleHorizontal size={36} />
        </Button>
      )}

      <video
        id="videoplayer"
        ref={ref}
        muted={false}
        loop
        playsInline
        preload={"auto"}
        poster={poster}
        controls={false}
        onClick={togglePlayPause}
        className={classNames(styles["video-content"], styles["video"])}
      >
        {sources?.map((source, idx) => <source key={`vid-${idx}`} src={source.url} type={source.mimeType} />)}
      </video>
    </div>
  );
};

export default VideoBlock;
