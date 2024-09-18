import classNames from "classnames";
import { forwardRef } from "react";

import styles from "./styles.module.scss";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const TextInput: React.ForwardRefRenderFunction<HTMLInputElement, Props> = (
  { label, className, ...props },
  ref
) => (
  <div className={classNames(styles["container"], className)}>
    {label && <label className={styles["label"]}>{label}</label>}
    <input ref={ref} className={styles["input-text"]} {...props} />
  </div>
);

export default forwardRef(TextInput);
