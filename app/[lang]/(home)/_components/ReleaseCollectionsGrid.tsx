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
  // When the count is odd, the first tile spans the full width as a hero row so the
  // remaining (even) tiles pair up cleanly below it.
  const isOdd = collections.length % 2 === 1;

  return (
    <div className={classNames(styles["collections-grid"], className)}>
      {collections.map((c, index) => {
        const isHero = isOdd && index === 0;
        return (
          <Link
            key={c.id}
            href={`/collection/${c.handle}`}
            className={classNames(styles["collections-grid-tile"], {
              [styles["collections-grid-tile--span-full"]]: isHero,
            })}
            aria-label={c.title}
          >
            {c.collectionImage ? (
              <Image
                key={c.collectionImage.url}
                src={c.collectionImage.url}
                alt={c.collectionImage.altText ?? c.title}
                fill
                blurSize={30}
                sizes={isHero ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                className={styles["collections-grid-image"]}
              />
            ) : (
              <span className={styles["collections-grid-fallback"]}>{c.title}</span>
            )}
          </Link>
        );
      })}
    </div>
  );
};
