import { Metadata, ResolvingMetadata } from "next";
import NextImage from "next/image";
import { getLocale } from "next-intl/server";

import { MediaImage, Video } from "@/gql/graphql";
import logo from "@/public/theos_rope_.png";
import CollectionVideo from "@components/CollectionVideo";
import { ShopProducts } from "@components/ShopProducts";
import Image from "@theos/Image";

import styles from "./styles.module.scss";
import { getTheosUOneBlockData } from "../action";

// eslint-disable-next-line no-empty-pattern
export async function generateMetadata({}, parent: ResolvingMetadata): Promise<Metadata> {
  const locale = await getLocale();
  const { images, description } = await getTheosUOneBlockData(locale.toUpperCase());

  const ogImages = images?.map((file: MediaImage) => ({
    url: file?.image?.url,
  }));

  const parentFields = await parent;

  return {
    title: `Club Theos · Theos U: One Block`,
    description: description,
    openGraph: {
      images: ogImages,
    },
    metadataBase: parentFields.metadataBase,
    ...parentFields.robots,
  };
}

const TheosUOneBlockPage = async () => {
  const locale = await getLocale();
  const { video, images, description, products } = await getTheosUOneBlockData(locale.toUpperCase());

  if (!products) {
    return null;
  }

  const mainVideo: Video = (video as Video) ?? undefined;

  return (
    <div className={styles["container"]}>
      <CollectionVideo
        videoSourcesDesktop={mainVideo?.sources ?? []}
        videoSourcesMobile={mainVideo?.sources ?? []}
      />
      <div className={styles["content"]}>
        <NextImage src={logo} alt={"logo"} className={styles["logo"]} />
        <p className={styles["description"]}>{description}</p>
      </div>
      <div className={styles["image-container"]}>
        {images?.map((file: MediaImage) => (
          <Image
            key={file.image?.url}
            src={file.image?.url ?? ""}
            alt={file.image?.altText ?? ""}
            className={styles["image"]}
          />
        ))}
      </div>
      <ShopProducts
        products={products ?? []}
        className={styles["shop-products"]}
        isCollection={true}
        centered
      />
    </div>
  );
};

export default TheosUOneBlockPage;
