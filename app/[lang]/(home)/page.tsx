import classNames from "classnames";
import { cookies } from "next/headers";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { LanguageCode } from "@/gql/graphql";
import { ShopProvider } from "@/lib/context/shop-context";
import { getReleaseData, getReleasePrimaryCollectionHandle, isMultiCollectionRelease } from "@/lib/data";
import { parseMetaobject, ValueMetaobject } from "@/lib/metaobjects";
import logo from "@/public/theos-new-logo.png";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import { redirect } from "@utils/navigation";

import shopStyles from "../(shop)/styles.module.scss";

import Countdown from "./_components/Countdown";
import { EarlyAccessButton } from "./_components/EarlyAccessButton";
import { ReleaseCollectionsGrid } from "./_components/ReleaseCollectionsGrid";
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

  const isAfterRelease = releaseDate && !isNaN(releaseDate.getTime()) && now > releaseDate;
  const isBeforeClose = !closeDate || isNaN(closeDate.getTime()) || now < closeDate;

  const primaryCollectionHandle = getReleasePrimaryCollectionHandle(data);

  const showMultiSpecialCollectionPicker = data.isSpecialCollection && data.collections.length > 0;

  const cookieStore = await cookies();
  const cookiePassword = cookieStore.get("theos_early_access")?.value;
  const hasEarlyAccess = Boolean(cookiePassword && data.password && cookiePassword === data.password);

  const showMultiCollectionGridLive = showMultiSpecialCollectionPicker && isAfterRelease && isBeforeClose;
  const showMultiCollectionGridEarlyAccess =
    showMultiSpecialCollectionPicker && hasEarlyAccess && isBeforeClose && !isAfterRelease;

  // During the live window, send everyone to shop or a single special collection — except
  // multi-collection releases, which must stay on home so the grid can render.
  if (isAfterRelease && isBeforeClose && !showMultiSpecialCollectionPicker) {
    redirect({
      href:
        data.isSpecialCollection && primaryCollectionHandle
          ? `/collection/${primaryCollectionHandle}`
          : "/shop",
      locale: language,
    });
  }

  // Multi-collection grid: live window, or before release with valid early-access cookie.
  if (showMultiCollectionGridLive || showMultiCollectionGridEarlyAccess) {
    return (
      <ShopProvider
        releaseCollectionHandle={primaryCollectionHandle}
        multiCollectionReleaseActive={isMultiCollectionRelease(data)}
      >
        <div className={styles["collections-viewport"]}>
          <div className={styles["collections-nav"]}>
            <Navbar />
          </div>
          <div className={styles["collections-page-shell"]}>
            <main className={classNames(shopStyles.container, styles["collections-main"])}>
              <div className={styles["collections-grid-shop-wrap"]}>
                <ReleaseCollectionsGrid
                  collections={data.collections}
                  className={styles["collections-grid--in-shop"]}
                />
              </div>
            </main>
            <div className={styles["collections-footer-wrap"]}>
              <Footer />
            </div>
          </div>
        </div>
      </ShopProvider>
    );
  }

  // Default countdown page (before release, after close, or non-special releases)
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
          <EarlyAccessButton
            expectedPassword={password?.value}
            redirectTo={showMultiSpecialCollectionPicker ? null : undefined}
          />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
