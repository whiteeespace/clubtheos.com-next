"use client";

import { useCart } from "@whiteeespace/core";
import classNames from "classnames";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Suspense, useCallback, useMemo } from "react";

import { Link, usePathname, useRouter } from "@/lib/navigation";
import logo from "@/public/theos-logo-black.png";
import Banner, { BannerSkeleton } from "@components/Banner";
import Button from "@theos/Button";
import MetaSelect from "@theos/MetaSelect";
import Search from "@theos/Search";

import styles from "./styles.module.scss";
import { MenuItem } from "..";
import { useShopContext } from "../../Layout/ShopContext";

interface Props {
  leftItems: MenuItem[];
  rightItems: MenuItem[];
}

export const DesktopNavBar: React.FC<Props> = ({ leftItems, rightItems }) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { isSearchOpen, setIsSearchOpen } = useShopContext();
  const t = useTranslations("navigation");
  const { totalQuantity } = useCart();
  const current = useMemo(() => {
    return leftItems.find((item) => item.to && pathname.toLowerCase().includes(item.to));
  }, [leftItems, pathname]);

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
    <nav className={styles["nav"]}>
      <div className={styles["header"]}>
        <div className={styles["left-items"]}>
          {leftItems.map((menuItem) => (
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
        </div>
        <Link className={styles["link"]} href={"/"}>
          <Image src={logo} alt={"logo"} className={styles["logo"]} />
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

      <div className={styles["sub-header"]}>
        <div className={styles["left-items"]}>
          {current?.items?.map((menuItem) => (
            <Button
              variant="secondary"
              onClick={() => menuItem.to && router.push(menuItem.to)}
              key={menuItem.title}
            >
              <div
                style={menuItem.to && pathname !== menuItem.to ? { color: menuItem.color } : undefined}
                className={classNames(styles["menu-item"], {
                  [styles["menu-item--selected"]]: menuItem.to && pathname.toLowerCase() === menuItem.to,
                })}
              >
                {menuItem.title}
              </div>
            </Button>
          ))}
        </div>
        <div className={styles["right-items"]}>
          <Search setShowInput={setIsSearchOpen} showInput={isSearchOpen} placeHolder={t("search.text")} />
        </div>
      </div>
      <Suspense fallback={<BannerSkeleton />}>{!/\/blog|\/blogue/.test(pathname) && <Banner />}</Suspense>
    </nav>
  );
};
