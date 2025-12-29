import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { LanguageCode } from "@/gql/graphql";
import { getReleaseData } from "@/lib/data";
import { parseMetaobject, ValueMetaobject } from "@/lib/metaobjects";
import logo from "@/public/theos-new-logo.png";
import { redirect } from "@utils/navigation";

import Countdown from "./_components/Countdown";
import { EarlyAccessButton } from "./_components/EarlyAccessButton";
import { ReleaseCollection } from "./_components/ReleaseCollection";
import styles from "./styles.module.scss";

const HomePage = async () => {
  const language = await getLocale();
  const t = await getTranslations("metadata.home");
  const data = await getReleaseData(language.toUpperCase() as LanguageCode);

  // Show "CLOSED" page when there's no release data
  if (!data) {
    return (
      <section className={styles.container}>
        <div className={styles.header}>
          <Image src={logo} alt={"logo"} className={styles.logo} />
        </div>
        <div className={styles.content}>
          <div className={styles["title-container"]}>
            <p className={styles.title}>CLOSED</p>
          </div>
        </div>
      </section>
    );
  }

  const releaseOn = parseMetaobject<ValueMetaobject>({ value: data.releaseOn ?? undefined });
  const closeOn = parseMetaobject<ValueMetaobject>({ value: data.closeOn ?? undefined });
  const password = parseMetaobject<ValueMetaobject>({ value: data.password ?? undefined });

  const releaseDate = releaseOn?.value ? new Date(releaseOn.value) : null;
  const closeDate = closeOn?.value ? new Date(closeOn.value) : null;
  const now = new Date();

  // Redirect to shop only if release is active (after release, before close)
  const isAfterRelease = releaseDate && !isNaN(releaseDate.getTime()) && now > releaseDate;
  const isBeforeClose = !closeDate || isNaN(closeDate.getTime()) || now < closeDate;

  if (isAfterRelease && isBeforeClose) {
    redirect({
      href: data.isSpecialCollection ? `/collection/${data.collection?.handle}` : "/shop",
      locale: language,
    });
  }

  // If this is a special collection release, show the custom collection page
  if (data.isSpecialCollection && data.collection) {
    return (
      <main>
        <div className={styles.headerCollection}>
          <Image src={logo} alt={"logo"} className={styles.logo} />
          <EarlyAccessButton
            expectedPassword={password?.value}
            redirectTo={`/collection/${data.collection?.handle}`}
          />
        </div>
        <ReleaseCollection collection={data.collection} expectedPassword={password?.value} />
      </main>
    );
  }

  // Default countdown page
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <Image src={logo} alt={"logo"} className={styles.logo} />
      </div>
      <div className={styles.content}>
        <div className={styles["title-container"]}>
          <p className={styles.title}>{t("next_release")}</p>
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
