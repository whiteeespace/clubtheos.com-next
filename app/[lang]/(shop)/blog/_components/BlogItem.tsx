"use client";

import { Image, ImageMetaobject, VideoMetaobject, parseMetaobject } from "@whiteeespace/core";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { GetBlogQuery, Video } from "gql/graphql";

import VideoBlock from "./VideoBlock";
import styles from "../styles.module.scss";

export const BlogItem: React.FC<{
  blog: GetBlogQuery["blog"]["nodes"][0];
}> = ({ blog }) => {
  const t = useTranslations("metadata");
  const imageContent =
    blog.content?.reference?.__typename === "MediaImage" && parseMetaobject<ImageMetaobject>(blog.content);
  const videoContent =
    blog.content?.reference?.__typename === "Video" && parseMetaobject<VideoMetaobject>(blog.content);
  const videoPoster = (blog.content?.reference as Video)?.previewImage?.url;
  const theosOwned = blog.theosOwned?.value;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      className={classNames(styles["blog-item"], {
        [styles["blog-item--video"]]: !imageContent,
      })}
    >
      {theosOwned === "false" && <p className={styles["statement-message"]}>{t("blog.statement")}</p>}
      {imageContent ? (
        <a href={blog.link?.value ?? undefined} target="_blank">
          <Image src={`${imageContent.image?.url}&w=1048`} alt={"image-blog"} className={styles["content"]} />
        </a>
      ) : (
        <VideoBlock
          poster={videoPoster}
          sources={videoContent ? videoContent?.sources : []}
          link={blog.link?.value ?? undefined}
        />
      )}

      <div className={styles["text-container"]}>
        <p className={styles["description"]}>{blog.description?.value}</p>
        <p className={styles["date"]}>{blog.date?.value}</p>
      </div>
    </motion.div>
  );
};
