"use client";

import { useCart } from "@shopify/hydrogen-react";
import classNames from "classnames";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

import { useShopContext } from "@/lib/context/shop-context";
import { Link, usePathname, useRouter } from "@/lib/navigation";
import logo from "@/public/theos-new-logo.png";
import Banner from "@components/Banner";
import Button from "@theos/Button";
import MetaSelect from "@theos/MetaSelect";

import { MenuItem } from "..";

import styles from "./styles.module.scss";

interface Props {
  banner?: string;
  rightItems: MenuItem[];
}

export const DesktopNavBar: React.FC<Props> = ({ rightItems, banner }) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const { totalQuantity } = useCart();
  const { releaseCollectionHandle, multiCollectionReleaseActive } = useShopContext();
  const logoHref = multiCollectionReleaseActive
    ? "/"
    : releaseCollectionHandle
      ? `/collection/${releaseCollectionHandle}`
      : "/shop";

  const onChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

  const languageOptions = useMemo(
    () => [
      {
        value: "en",
        label: "English",
      },
      {
        value: "fr",
        label: "Français",
      },
    ],
    []
  );
  const convertValueToLabel = useCallback(
    (value: string) => {
      return languageOptions.find((option) => option.value === value)?.label;
    },
    [languageOptions]
  );

  return (
    <nav className={classNames(styles.nav, { [styles["nav--banner"]]: banner })}>
      <div className={styles.header}>
        <Link className={styles.link} href={logoHref}>
          <Image src={logo} alt={"logo"} className={styles.logo} />
        </Link>
        <div className={styles["right-items"]}>
          {rightItems.map((menuItem) => (
            <Button
              variant="secondary"
              onClick={() => menuItem.to && router.push(menuItem.to)}
              key={menuItem.title}
            >
              <div
                className={classNames(styles["menu-item"], {
                  [styles["menu-item--selected"]]:
                    menuItem.to && pathname.toLowerCase().includes(menuItem.to),
                })}
              >
                {menuItem.title}
              </div>
            </Button>
          ))}
          <MetaSelect
            label={convertValueToLabel(locale) ?? "Language"}
            value={locale}
            setValue={onChange}
            options={languageOptions}
          />
          <Button variant="secondary" onClick={() => router.push("/cart")}>
            <div className={styles["menu-item"]}>
              {t("cart")} {!!totalQuantity && <>· {totalQuantity}</>}
            </div>
          </Button>
        </div>
      </div>
      {banner && <Banner text={banner} />}
    </nav>
  );
};
