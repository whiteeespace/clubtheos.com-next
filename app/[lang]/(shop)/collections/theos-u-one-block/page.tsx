import { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";

import { MediaImage } from "@/gql/graphql";
import { ShopProducts } from "@components/ShopProducts";
import Image from "@theos/Image";

import styles from "./styles.module.scss";
import { getJArthurCollaborationData, getTheosUOneBlockData } from "../action";

// eslint-disable-next-line no-empty-pattern
export async function generateMetadata({}, parent: ResolvingMetadata): Promise<Metadata> {
  const locale = await getLocale();
  const { title, description, products } = await getJArthurCollaborationData(locale.toUpperCase());

  const images = products?.map((product) => product.featuredImage?.url);
  const parentFields = await parent;

  return {
    title: `Club Theos · ${title.value}`,
    description: description.value,
    openGraph: {
      images,
    },
    metadataBase: parentFields.metadataBase,
    ...parentFields.robots,
  };
}

const TheosUOneBlockPage = async () => {
  const locale = await getLocale();
  const { images, description, products } = await getTheosUOneBlockData(locale.toUpperCase());

  if (!products) {
    return null;
  }

  return (
    <div className={styles["container"]}>
      <div className={styles["content"]}>
        <h1 className={styles["title"]}>Theos</h1>
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
