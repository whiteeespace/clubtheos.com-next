import { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";

import { MediaImage } from "@/gql/graphql";
import { ShopProducts } from "@components/ShopProducts";
import Image from "@theos/Image";

import styles from "./styles.module.scss";
import { getTheosBeanieClassOf24Data } from "../action";

// eslint-disable-next-line no-empty-pattern
export async function generateMetadata({}, parent: ResolvingMetadata): Promise<Metadata> {
  const locale = await getLocale();
  const { productData } = await getTheosBeanieClassOf24Data(locale.toUpperCase());

  const images = productData?.map((product) => product.featuredImage?.url);
  const parentFields = await parent;

  return {
    title: "Club Theos · Theos Beanie Class of 24",
    description: "Collection of Beanies made by Club Theos Inc.",
    openGraph: {
      images,
    },
    metadataBase: parentFields.metadataBase,
    ...parentFields.robots,
  };
}

const TheosBeaniePage = async () => {
  const locale = await getLocale();
  const { images, productData } = await getTheosBeanieClassOf24Data(locale.toUpperCase());

  if (!productData) {
    return null;
  }

  return (
    <div className={styles["container"]}>
      <div className={styles["titles-container"]}>
        <div className={styles["title"]}>CLASS OF &apos;24</div>
        <div className={styles["subtitle"]}>THEOS ACADEMY</div>
        <div className={styles["date"]}>03 / 07 / 2024</div>
      </div>
      <ShopProducts products={productData ?? []} className={styles["shop-products"]} isCollection={true} />
      <div>
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
      </div>
    </div>
  );
};

export default TheosBeaniePage;
