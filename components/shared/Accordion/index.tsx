import { Accordion as ArkAccordion } from "@ark-ui/react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import classNames from "classnames";
import { PropsWithChildren } from "react";

import styles from "./styles.module.scss";

interface AccordionProps {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordioGroupProps {
  className?: string;
}

export const AccordionGroup: React.FC<PropsWithChildren<AccordioGroupProps>> = ({ children, className }) => (
  <ArkAccordion.Root className={classNames(styles.root, className)} collapsible>
    {children}
  </ArkAccordion.Root>
);

export const Accordion: React.FC<PropsWithChildren<AccordionProps>> = ({ id, title, content }) => {
  return (
    <ArkAccordion.Item className={styles.item} value={id}>
      <ArkAccordion.ItemTrigger className={styles.trigger}>
        {title}
        <ArkAccordion.ItemIndicator>
          <CaretDown className={styles.caret} aria-hidden />
        </ArkAccordion.ItemIndicator>
      </ArkAccordion.ItemTrigger>
      <ArkAccordion.ItemContent className={styles.content}>
        <div className={styles["content-text"]}>{content}</div>
      </ArkAccordion.ItemContent>
    </ArkAccordion.Item>
  );
};
