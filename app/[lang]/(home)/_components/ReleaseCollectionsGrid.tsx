import classNames from "classnames";

import Image from "@/components/shared/Image";
import type { ReleaseCollection as ReleaseCollectionType } from "@/lib/data/get-release-data";
import { Link } from "@utils/navigation";

import styles from "../styles.module.scss";

interface Props {
  collections: ReleaseCollectionType[];
  className?: string;
}

export const ReleaseCollectionsGrid: React.FC<Props> = ({ collections, className }) => {
  return (
    <div className={classNames(styles["collections-grid"], className)}>
      {collections.map((c) => (
        <Link
          key={c.id}
          href={`/collection/${c.handle}`}
          className={styles["collections-grid-tile"]}
          aria-label={c.title}
        >
          {c.collectionImage ? (
            <Image
              key={c.collectionImage.url}
              src={c.collectionImage.url}
              alt={c.collectionImage.altText ?? c.title}
              fill
              blurSize={30}
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles["collections-grid-image"]}
            />
          ) : (
            <span className={styles["collections-grid-fallback"]}>{c.title}</span>
          )}
        </Link>
      ))}
    </div>
  );
};
