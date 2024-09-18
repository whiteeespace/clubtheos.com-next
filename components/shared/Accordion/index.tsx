import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import * as RadixAccordion from "@radix-ui/react-accordion";
import classNames from "classnames";
import { PropsWithChildren, forwardRef } from "react";

import styles from "./styles.module.scss";

interface AccordionProps {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordioGroupProps {
  className?: string;
}

const AccordionTrigger = forwardRef<HTMLButtonElement, PropsWithChildren>(
  ({ children, ...props }, forwardedRef) => (
    <RadixAccordion.Header className={styles["header"]}>
      <RadixAccordion.Trigger className={styles["trigger"]} {...props} ref={forwardedRef}>
        {children}
        <CaretDown className={styles["caret"]} aria-hidden />
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  )
);

const AccordionContent = forwardRef<HTMLDivElement, PropsWithChildren>(
  ({ children, ...props }, forwardedRef) => (
    <RadixAccordion.Content className={styles["content"]} {...props} ref={forwardedRef}>
      <div className={styles["content-text"]}>{children}</div>
    </RadixAccordion.Content>
  )
);

AccordionTrigger.displayName = "AccordionTrigger";
AccordionContent.displayName = "AccordionContent";

export const AccordionGroup: React.FC<PropsWithChildren<AccordioGroupProps>> = ({ children, className }) => (
  <RadixAccordion.Root className={classNames(styles["root"], className)} type="single" collapsible>
    {children}
  </RadixAccordion.Root>
);

export const Accordion: React.FC<PropsWithChildren<AccordionProps>> = ({ id, title, content }) => {
  return (
    <RadixAccordion.Item className={styles["item"]} value={id}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>{content}</AccordionContent>
    </RadixAccordion.Item>
  );
};
