import classNames from "classnames";
import Image from "next/image";

import logo from "@/public/theos-o-logo.png";

import styles from "./styles.module.scss";

interface Props {
  className?: string;
}

const Loader: React.FC<Props> = ({ className }) => {
  return <Image src={logo} alt={"theos-logo"} className={classNames(styles["logo"], className)} />;
};

export default Loader;
