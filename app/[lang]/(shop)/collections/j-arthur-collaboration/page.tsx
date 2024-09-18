import { getLocale } from "next-intl/server";

import { ShopProducts } from "@components/ShopProducts";

import CollectionVideo from "./_components/CollectionVideo";
import styles from "./styles.module.scss";
import { getJArthurCollaborationData } from "../action";

const JArthurCollaborationPage = async () => {
  const locale = await getLocale();
  const { mainVideoDesktop, mainVideoMobile, title, description, products } =
    await getJArthurCollaborationData(locale.toUpperCase());

  if (!products) {
    return null;
  }

  return (
    <div className={styles["container"]}>
      <CollectionVideo
        videoSourcesDesktop={mainVideoDesktop.sources ?? []}
        videoSourcesMobile={mainVideoMobile.sources ?? []}
      />
      <div className={styles["content"]}>
        <h1 className={styles["title"]}>{title.value}</h1>
        <p>{description.value}</p>
      </div>
      <ShopProducts products={products ?? []} className={styles["shop-products"]} isCollection={true} />
    </div>
  );
};

export default JArthurCollaborationPage;
