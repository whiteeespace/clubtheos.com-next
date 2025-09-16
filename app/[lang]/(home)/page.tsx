import { parseMetaobject, ValueMetaobject } from "@whiteeespace/core/utils";
import { cookies } from "next/headers";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";

import { LanguageCode } from "@/gql/graphql";
import logo from "@/public/theos-new-logo.png";
import { redirect } from "@utils/navigation";

import Countdown from "./_components/Countdown";
import { EarlyAccessButton } from "./_components/EarlyAccessButton";
import styles from "./styles.module.scss";
import { getReleaseDataCached } from "../(shop)/action";

const HomePage = async () => {
  const language = await getLocale();
  const t = await getTranslations("metadata.home");
  const data = await getReleaseDataCached(language.toUpperCase() as LanguageCode);
  if (!data) return <></>;

  const releaseOn = parseMetaobject<ValueMetaobject>({ value: data.releaseOn ?? undefined });
  const password = parseMetaobject<ValueMetaobject>({ value: data.password ?? undefined });

  const cookiePassword = cookies().get("theos_early_access")?.value;
  if (password?.value && cookiePassword && cookiePassword === password.value) {
    redirect(`/shop`);
  }

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
          <EarlyAccessButton expectedPassword={password?.value} />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
