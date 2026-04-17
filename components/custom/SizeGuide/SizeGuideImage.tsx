import Image from "next/image";

import longSleeve from "./images/long-sleeve.png";
import pants from "./images/pants.png";
import shortSleeve from "./images/short-sleeve.png";
import styles from "./styles.module.scss";

interface SizeGuideImageProps {
  sizeGuide: string;
}

export const SizeGuideImage: React.FC<SizeGuideImageProps> = ({ sizeGuide }) => {
  const getImage = () => {
    switch (sizeGuide) {
      case "short sleeve top":
        return shortSleeve;
      case "long sleeve top":
        return longSleeve;
      case "pants":
        return pants;
      default:
        return null;
    }
  };

  const image = getImage();

  if (!image) return null;

  return (
    <div className={styles.imageWrap}>
      <Image
        src={image}
        alt={`Size guide for ${sizeGuide}`}
        placeholder={"empty"}
        className={styles.image}
        width={600}
        height={600}
        sizes="(max-width: 768px) 85vw, 600px"
        priority
      />
    </div>
  );
};
