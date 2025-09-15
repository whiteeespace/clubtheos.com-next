"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useCart } from "@whiteeespace/core";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Suspense, useCallback, useState } from "react";

import cart from "@/public/cart.png";
import menu from "@/public/menu.png";
import logo from "@/public/theos-new-logo.png";
import Button from "@theos/Button";
import { Link, usePathname, useRouter } from "@utils/navigation";
import Banner from "components/custom/Banner";

import styles from "./styles.module.scss";
import { MenuItem } from "..";

interface MenuLinkProps {
  onClick: () => void;
  item: MenuItem;
}

const MenuLink: React.FC<MenuLinkProps> = ({ onClick, item }) => {
  if (!item.to) {
    return (
      <div role="button" onClick={onClick} className={styles["drawer--link"]}>
        <h2 style={{ color: item.color }} className={styles["drawer--link--text"]}>
          {item.title}
        </h2>
      </div>
    );
  }
  return (
    <Link onClick={onClick} className={styles["drawer--link"]} href={item.to}>
      <h2 style={{ color: item.color }} className={styles["drawer--link--text"]}>
        {item.title}
      </h2>
    </Link>
  );
};

interface DrawerProps {
  menuItems: MenuItem[];
}

const Menu: React.FC<DrawerProps> = ({ menuItems }) => {
  const [open, setOpen] = useState(false);
  const [subMenu, setSubMenu] = useState<MenuItem | null>(null);

  const onChange = useCallback((open: boolean = false) => {
    setOpen(open);
    setSubMenu(null);
  }, []);

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onChange}>
        <Dialog.Trigger asChild>
          <Button variant="secondary" className={styles["menu-button"]}>
            <Image src={menu} alt={"menu"} className={styles["menu"]} />
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={styles["dialog-overlay"]} />
          <Dialog.Content
            aria-describedby={"menu-content"}
            onOpenAutoFocus={(e) => {
              e.preventDefault();
            }}
            className={styles["dialog-content"]}
          >
            <VisuallyHidden>
              <Dialog.Title>Menu</Dialog.Title>
              <Dialog.Description>Shop mobile menu</Dialog.Description>
            </VisuallyHidden>
            <div className={styles["drawer"]} id={"menu-content"}>
              <Dialog.Close asChild>
                <Link onClick={() => onChange()} className={styles["shop-link"]} href={"/"}>
                  <Image src={logo} alt={"logo"} className={styles["menu-logo"]} />
                </Link>
              </Dialog.Close>

              {!subMenu ? (
                <>
                  {menuItems.map((item) =>
                    item.items ? (
                      <div
                        onClick={() => setSubMenu(item)}
                        className={styles["drawer--link"]}
                        key={`${item.to}-${item.title}`}
                      >
                        <h2 className={styles["drawer--link--text"]}>{item.title}</h2>
                      </div>
                    ) : (
                      <MenuLink
                        key={`${item.to}-${item.title}`}
                        onClick={() => {
                          item.onClick?.();
                          onChange();
                        }}
                        item={item}
                      />
                    )
                  )}
                </>
              ) : (
                <>
                  {subMenu.items?.map((item) => (
                    <MenuLink
                      key={`${item.to}-${item.title}`}
                      onClick={() => {
                        item.onClick?.();
                        onChange();
                      }}
                      item={item}
                    />
                  ))}
                </>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

interface Props {
  menuItems: MenuItem[];
}

export const MobileNavBar: React.FC<Props> = ({ menuItems }) => {
  const { totalQuantity } = useCart();
  const t = useTranslations("language");
  const pathname = usePathname();
  const router = useRouter();

  const onChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

  const languageMenuItems = [
    {
      title: t("title"),
      to: "/",
      items: [
        {
          title: "English",
          onClick: () => onChange("EN"),
        },
        {
          title: "Français",
          onClick: () => onChange("FR"),
        },
      ],
    },
  ];

  return (
    <nav className={styles["nav"]}>
      <div className={styles["header"]}>
        <Link className={styles["shop-link"]} href={"/shop"}>
          <Image src={logo} alt={"logo"} className={styles["menu-logo"]} />
        </Link>
        <div className={styles["button-container"]}>
          <Button variant="secondary" onClick={() => router.push("/cart")} className={styles["menu-button"]}>
            <Image src={cart} alt={"cart"} className={styles["cart"]} />
            {!!totalQuantity && <span className={styles["cart-quantity"]}>{totalQuantity}</span>}
          </Button>
          <Menu menuItems={[...menuItems, ...languageMenuItems]} />
        </div>
      </div>
      <Suspense fallback={<></>}>{!/\/blog|\/blogue/.test(pathname) && <Banner />}</Suspense>
    </nav>
  );
};
