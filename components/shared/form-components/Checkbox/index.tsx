"use client";

import { forwardRef } from "react";

import styles from "./styles.module.scss";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
}

type Ref = HTMLInputElement;

const Checkbox = forwardRef<Ref, Props>(({ label, className, ...props }, ref) => (
  <div className={className}>
    <label className={styles["label"]}>
      <input ref={ref} type="checkbox" className={styles["checkbox"]} {...props} />
      {label}
    </label>
  </div>
));

Checkbox.displayName = "Checkbox";
export default Checkbox;
