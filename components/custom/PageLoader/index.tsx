import Loader from "@/components/shared/Loader";

import styles from "./styles.module.scss";

const PageLoader: React.FC = () => {
  return (
    <div className={styles["container"]}>
      <Loader className={styles["loader"]} />
    </div>
  );
};

export default PageLoader;
