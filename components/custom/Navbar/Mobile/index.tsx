"use client";

import { Dialog, Portal } from "@ark-ui/react";
import { useCart } from "@shopify/hydrogen-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

import { useShopContext } from "@/lib/context/shop-context";
import cart from "@/public/cart.png";
import menu from "@/public/menu.png";
import logo from "@/public/theos-new-logo.png";
import Button from "@theos/Button";
import { Link, usePathname, useRouter } from "@utils/navigation";
import Banner from "components/custom/Banner";

import { MenuItem } from "..";

import styles from "./styles.module.scss";

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
    <Dialog.Root open={open} onOpenChange={(e) => onChange(e.open)} lazyMount unmountOnExit>
      <Dialog.Trigger asChild>
        <Button variant="secondary" className={styles["menu-button"]}>
          <Image src={menu} alt={"menu"} className={styles.menu} />
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop className={styles["dialog-overlay"]} />
        <Dialog.Positioner>
          <Dialog.Content aria-describedby={"menu-content"} className={styles["dialog-content"]}>
            <span className={styles["sr-only"]}>
              <Dialog.Title>Menu</Dialog.Title>
              <Dialog.Description>Shop mobile menu</Dialog.Description>
            </span>
            <div className={styles.drawer} id={"menu-content"}>
              <Dialog.CloseTrigger asChild>
                <Link onClick={() => onChange()} className={styles["shop-link"]} href={"/"}>
                  <Image src={logo} alt={"logo"} className={styles["menu-logo"]} />
                </Link>
              </Dialog.CloseTrigger>

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
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

interface Props {
  menuItems: MenuItem[];
  banner?: string;
}

export const MobileNavBar: React.FC<Props> = ({ menuItems, banner }) => {
  const { totalQuantity } = useCart();
  const { releaseCollectionHandle } = useShopContext();
  const t = useTranslations("language");
  const pathname = usePathname();
  const router = useRouter();

  const logoHref = releaseCollectionHandle ? `/collection/${releaseCollectionHandle}` : "/shop";

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
    <nav className={styles.nav}>
      <div className={styles.header}>
        <Link className={styles["shop-link"]} href={logoHref}>
          <Image src={logo} alt={"logo"} className={styles["menu-logo"]} />
        </Link>
        <div className={styles["button-container"]}>
          <Button variant="secondary" onClick={() => router.push("/cart")} className={styles["menu-button"]}>
            <Image src={cart} alt={"cart"} className={styles.cart} />
            {!!totalQuantity && <span className={styles["cart-quantity"]}>{totalQuantity}</span>}
          </Button>
          <Menu menuItems={[...menuItems, ...languageMenuItems]} />
        </div>
      </div>
      {banner && <Banner text={banner} />}
    </nav>
  );
};
