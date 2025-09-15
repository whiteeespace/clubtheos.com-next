import { getClient, parseMetaobject, ValueMetaobject } from "@whiteeespace/core/utils";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";

import { LanguageCode } from "@/gql/graphql";
import { GET_RELEASE_DATA } from "@/lib/queries/get-release-data";
import logo from "@/public/theos-new-logo.png";
import { redirect } from "@utils/navigation";

import Countdown from "./_components/Countdown";
import { EarlyAccessButton } from "./_components/EarlyAccessButton";
import styles from "./styles.module.scss";

const HomePage = async () => {
  const language = await getLocale();
  const t = await getTranslations("metadata.home");
  const result = await getClient().query(GET_RELEASE_DATA, {
    language: language.toUpperCase() as LanguageCode,
  });
  const releaseObject = result.data?.metaobjects.nodes[0];
  if (!releaseObject) return <></>;

  const releaseOn = parseMetaobject<ValueMetaobject>(releaseObject.releaseOn);

  const releaseDate = releaseOn?.value ? new Date(releaseOn.value) : null;
  if (releaseDate && !isNaN(releaseDate.getTime()) && new Date() > releaseDate) {
    redirect(`/shop`);
  }

  return (
    <section className={styles["container"]}>
      <div className={styles["header"]}>
        <Image src={logo} alt={"logo"} className={styles["logo"]} />
      </div>
      <div className={styles["content"]}>
        <div className={styles["title-container"]}>
          <p className={styles["title"]}>{t("next_release")}</p>
        </div>
        <div className={styles["release-on"]}>
          <Countdown targetDateString={releaseOn?.value} />
        </div>
        <div className={styles["button-container"]}>
          <EarlyAccessButton />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
