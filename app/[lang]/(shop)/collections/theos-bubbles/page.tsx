import { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";
import Marquee from "react-fast-marquee";

import { ShopProducts } from "@components/ShopProducts";
import Image from "@theos/Image";

import styles from "./styles.module.scss";
import { getTheosBubblesData } from "../action";

// eslint-disable-next-line no-empty-pattern
export async function generateMetadata({}, parent: ResolvingMetadata): Promise<Metadata> {
  const locale = await getLocale();
  const { title, productData } = await getTheosBubblesData(locale.toUpperCase());

  const images = productData?.map((product) => product.featuredImage?.url).filter((url) => url !== undefined);
  const parentFields = await parent;

  return {
    title: `Club Theos · ${title.value}`,
    description: "Theos Bubbles. 2024.",
    openGraph: {
      images,
    },
    metadataBase: parentFields.metadataBase,
    ...parentFields.robots,
  };
}

const TheosBubblesPage = async () => {
  const locale = await getLocale();
  const { photoshootData, title, productData } = await getTheosBubblesData(locale.toUpperCase());

  if (!productData) {
    return null;
  }

  return (
    <div className={styles["container"]}>
      <Marquee speed={100} className={styles["marquee"]}>
        {photoshootData.references?.map((reference, idx) => (
          <div key={`image-bubbles-${idx}`} className={styles["image-container"]}>
            <Image className={styles["image"]} src={reference.image?.url} alt="photoshoot img" />
          </div>
        ))}
      </Marquee>
      <h1 className={styles["title"]}>{title.value}</h1>
      <ShopProducts products={productData ?? []} className={styles["shop-products"]} isCollection={true} />
    </div>
  );
};

export default TheosBubblesPage;
