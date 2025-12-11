import { Menu, Portal } from "@ark-ui/react";
import { Check } from "@phosphor-icons/react/dist/ssr";
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
    <Menu.Root positioning={{ placement: "bottom", gutter: 8 }}>
      <Menu.Trigger className={styles["trigger-button"]} aria-label={label}>
        {label}
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content className={styles.content}>
            <Menu.RadioItemGroup value={value} onValueChange={(e) => setValue(e.value)}>
              {options.map((option) => (
                <Menu.RadioItem className={styles["radio-item"]} value={option.value} key={option.value}>
                  <span className={styles.indicator}>
                    <Menu.ItemIndicator>
                      <Check size={12} weight="bold" />
                    </Menu.ItemIndicator>
                  </span>
                  <Menu.ItemText>{option.label}</Menu.ItemText>
                </Menu.RadioItem>
              ))}
            </Menu.RadioItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default MetaSelect;
