import {
  getClient,
  ImageMetaobject,
  parseMetaobject,
  ValueMetaobject,
  VideoMetaobject,
} from "@whiteeespace/core/utils";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import React from "react";

import { LanguageCode } from "@/gql/graphql";
import { GET_HOME_PAGE } from "@/lib/queries/get-home-page-data";

import FadeContainer from "./_components/FadeContainer";
import Logo from "./_components/Logo";
import styles from "./styles.module.scss";

export const Home = async () => {
  const language = await getLocale();
  const result = await getClient().query(GET_HOME_PAGE, { language: language.toUpperCase() as LanguageCode });
  const homeObject = result.data?.metaobject;

  if (!homeObject) return <></>;

  const banner = parseMetaobject<ImageMetaobject>(homeObject.banner);
  const mobileBanner = parseMetaobject<ImageMetaobject>(homeObject.mobileBanner);
  const bannerVideo = parseMetaobject<VideoMetaobject>(homeObject.bannerVideo);
  const mobileBannerVideo = parseMetaobject<VideoMetaobject>(homeObject.mobileBannerVideo);
  const logo = parseMetaobject<ImageMetaobject>(homeObject.logo);
  const redirectPath = parseMetaobject<ValueMetaobject>(homeObject.redirectPath);

  return (
    <FadeContainer redirectPath={redirectPath?.value || "/shop"}>
      {logo?.image?.url && <Logo src={logo.image?.url} alt={"theos-logo"} />}
      {mobileBanner?.image?.url ? (
        <Image
          src={mobileBanner.image?.url}
          placeholder={"blur"}
          blurDataURL={`${mobileBanner.image?.url}?w=100&q=10`}
          alt={"home-banner"}
          fill={true}
          className={styles["banner--mobile"]}
        />
      ) : (
        <video id="videoplayer" muted autoPlay playsInline loop className={styles["banner--mobile"]}>
          {mobileBannerVideo &&
            mobileBannerVideo?.sources?.map((source) => (
              <source key={source.url} src={source.url} type={source.mimeType} />
            ))}
        </video>
      )}

      {banner?.image?.url ? (
        <Image
          src={banner.image?.url}
          placeholder={"blur"}
          blurDataURL={`${banner.image?.url}?w=100&q=10`}
          alt={"home-banner"}
          fill={true}
          className={styles["banner--desktop"]}
        />
      ) : (
        <video id="videoplayer" muted autoPlay playsInline loop className={styles["banner--desktop"]}>
          {bannerVideo &&
            bannerVideo?.sources?.map((source) => (
              <source key={source.url} src={source.url} type={source.mimeType} />
            ))}
        </video>
      )}
    </FadeContainer>
  );
};

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }) {
  const title = lang === "fr" ? "Accueil" : "Home";
  const description =
    lang === "fr"
      ? "Bienvenue sur notre application Next.js multilingue"
      : "Welcome to our multilingual Next.js application";

  return {
    title,
    description,
  };
}

export default Home;
