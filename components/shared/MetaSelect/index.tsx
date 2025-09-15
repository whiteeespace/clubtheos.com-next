import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";

import styles from "./styles.module.scss";

interface RadioOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: RadioOption[];
}

const MetaSelect: React.FC<Props> = ({ label, value, setValue, options }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div role="button" aria-label={label} className={styles["trigger-button"]}>
          {label}
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={8} className={styles["content"]}>
          <DropdownMenu.RadioGroup value={value} onValueChange={setValue}>
            {options.map((option) => (
              <DropdownMenu.RadioItem
                className={styles["radio-item"]}
                value={option.value}
                key={option.value}
              >
                {option.label}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default MetaSelect;
