import { RichText } from "@shopify/hydrogen-react";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import React from "react";

import ShopImage from "./_components/ShopImage";
import { getAboutData } from "./action";
import styles from "./styles.module.scss";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Our mission is to curate the most fashionable and distinctive items, fostering connections with the neighbourhoods in which we operate.",
};

const AboutPage = async () => {
  const locale = await getLocale();

  const {
    shopImage,
    shopHours,
    shopHourText,
    shopHolidayHours,
    shopAddress,
    shopPhoneNumber,
    shopDescription,
  } = await getAboutData(locale.toUpperCase());

  return (
    <div className={styles["container"]}>
      <div className={styles["info-container"]}>
        <div className={styles["details-container"]}>
          <h1>© CLUB THEOS</h1>
          <p className={styles["mission"]}>{shopDescription.value}</p>
          <p>
            <b>Location:</b> {shopAddress.value}
          </p>
          <p>{shopPhoneNumber.value}</p>
        </div>
        <div className={styles["store-container"]}>
          <h2>{shopHourText.value}</h2>
          {shopHours.value && <RichText data={shopHours.value} />}
          {shopHolidayHours.value && <RichText data={shopHolidayHours.value} />}
        </div>
      </div>
      <ShopImage shopImage={shopImage} />
    </div>
  );
};

export default AboutPage;
