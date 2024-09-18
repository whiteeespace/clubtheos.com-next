import classNames from "classnames";
import { useTranslations } from "next-intl";
import { PartialDeep } from "type-fest";

import { Product } from "@/gql/graphql";
import Item from "@theos/Item";
import { Link } from "@utils/navigation";

import styles from "./styles.module.scss";
interface ProductsProps {
  products: PartialDeep<Product, { recurseIntoArrays: true }>[];
  productCount?: number;
  currentPage?: number;
  isCollection?: boolean;
  onLinkClick?: () => void;
  className?: string;
}

export const ShopProducts: React.FC<ProductsProps> = ({
  products,
  productCount,
  currentPage,
  isCollection,
  className,
  onLinkClick,
}) => {
  const t = useTranslations("metadata");

  if (products.length === 0) {
    return <div className={styles["no-products-container"]}>{t("shop.no_products")}</div>;
  }

  const countText = productCount === 1 ? t("shop.product") : t("shop.products");
  const currentProducts = currentPage ? (currentPage - 1) * 32 + 1 : 1;

  return (
    <div className={styles["products-container"]}>
      {currentProducts && productCount && (
        <p className={styles["product-count"]}>
          {currentProducts}-{currentProducts + products.length - 1} of {productCount} {countText}
        </p>
      )}
      <div
        className={classNames(
          styles["products"],
          {
            [styles["products--collection"]]: isCollection,
            [styles["products--non-collection"]]: !isCollection,
          },
          className
        )}
      >
        {products.map((node) => (
          <Link onClick={onLinkClick} href={`/product/${node.handle}`} key={node.handle}>
            {node.handle && node.title && node.priceRange && <Item product={node} />}
          </Link>
        ))}
      </div>
    </div>
  );
};
