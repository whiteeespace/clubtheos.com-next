"use client";

import classNames from "classnames";
import Marquee from "react-fast-marquee";

import styles from "./styles.module.scss";

interface Props {
  text: string;
  className?: string;
}

const Banner: React.FC<Props> = ({ text, className }) => (
  <div className={classNames(styles.banner, className)}>
    <Marquee speed={10}>
      <div className={styles["banner-marquee"]}>
        {Array(12)
          .fill(0)
          .map((_, ind) => (
            <p key={ind}>{text}</p>
          ))}
      </div>
    </Marquee>
  </div>
);

export default Banner;
