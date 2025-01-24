import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import classNames from "classnames";
import React from "react";

import styles from "./styles.module.scss";

interface SelectProps {
  label?: string;
  disabled?: boolean;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  disabled = false,
  value,
  onValueChange,
  placeholder,
  className,
  children,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange(event.target.value);
  };

  return (
    <div className={classNames(styles.selectContainer, className)}>
      <select className={styles.select} disabled={disabled} value={value} onChange={handleChange}>
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <CaretDown className={styles.caretDown} />
    </div>
  );
};

export default Select;

export const SelectItem: React.FC<React.OptionHTMLAttributes<HTMLOptionElement>> = (props) => {
  return <option {...props} />;
};
