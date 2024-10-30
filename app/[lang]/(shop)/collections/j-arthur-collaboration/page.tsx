import { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";

import { Video } from "@/gql/graphql";
import CollectionVideo from "@components/CollectionVideo";
import { ShopProducts } from "@components/ShopProducts";

import styles from "./styles.module.scss";
import { getJArthurCollaborationData } from "../action";

// eslint-disable-next-line no-empty-pattern
export async function generateMetadata({}, parent: ResolvingMetadata): Promise<Metadata> {
  const locale = await getLocale();
  const { title, description, products } = await getJArthurCollaborationData(locale.toUpperCase());

  const images = products?.map((product) => product.featuredImage?.url);
  const parentFields = await parent;

  return {
    title: `Club Theos · ${title}`,
    description: description,
    openGraph: {
      images,
    },
    metadataBase: parentFields.metadataBase,
    ...parentFields.robots,
  };
}

const JArthurCollaborationPage = async () => {
  const locale = await getLocale();
  const { video, title, description, products } = await getJArthurCollaborationData(locale.toUpperCase());

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
        <h1 className={styles["title"]}>{title}</h1>
        <p>{description}</p>
      </div>
      <ShopProducts products={products ?? []} className={styles["shop-products"]} isCollection={true} />
    </div>
  );
};

export default JArthurCollaborationPage;
