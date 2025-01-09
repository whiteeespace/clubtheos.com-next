import classNames from "classnames";
import React from "react";

import Button from "@theos/Button";
import { Dialog } from "@theos/Dialog";
import { VariantSizeChart } from "@utils/utils/get-variant-size-chart";

import { SizeChart } from "./SizeChart";
import { SizeGuideImage } from "./SizeGuideImage";
import styles from "./styles.module.scss";

interface SizeGuideProps {
  sizeGuide?: string;
  sizeChart?: VariantSizeChart[];
  className?: string;
}

export const SizeGuide: React.FC<SizeGuideProps> = ({ sizeGuide, sizeChart, className }) => {
  if (!sizeGuide || !sizeChart) return null;

  return (
    <Dialog
      title="Size Chart"
      description="Size Chart"
      trigger={
        <Button variant="link" className={classNames(styles["trigger"], className)}>
          Size guide
        </Button>
      }
    >
      <div className={styles["size-guide"]}>
        <SizeGuideImage sizeGuide={sizeGuide} />
        <SizeChart sizeChart={sizeChart} sizeGuide={sizeGuide} />
      </div>
    </Dialog>
  );
};
