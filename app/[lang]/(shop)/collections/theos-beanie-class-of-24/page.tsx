import { getLocale } from "next-intl/server";

import { ShopProducts } from "@components/ShopProducts";
import Image from "@theos/Image";

import styles from "./styles.module.scss";
import { getTheosBeanieClassOf24Data } from "../action";

const TheosBeaniePage = async () => {
  const locale = await getLocale();
  const { photoshoot, productData } = await getTheosBeanieClassOf24Data(locale.toUpperCase());

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
          {photoshoot?.map((picture) => (
            <Image
              key={picture.image?.url}
              src={picture.image?.url}
              alt={picture.image?.altText ?? ""}
              className={styles["image"]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheosBeaniePage;
