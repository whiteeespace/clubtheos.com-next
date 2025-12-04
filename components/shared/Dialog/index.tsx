import { Dialog as ArkDialog, Portal } from "@ark-ui/react";
import { X } from "@phosphor-icons/react/dist/ssr";
import { PropsWithChildren } from "react";

import styles from "./styles.module.scss";

interface DialogProps extends PropsWithChildren {
  title: string;
  description: string;
  trigger: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ children, title, description, trigger }) => (
  <ArkDialog.Root lazyMount unmountOnExit>
    <ArkDialog.Trigger asChild>{trigger}</ArkDialog.Trigger>
    <Portal>
      <ArkDialog.Backdrop className={styles.backdrop} />
      <ArkDialog.Positioner className={styles.positioner}>
        <ArkDialog.Content className={styles.content}>
          <div className={styles.header}>
            <ArkDialog.Title className={styles.title}>{title}</ArkDialog.Title>
            <ArkDialog.CloseTrigger className={styles.close} asChild>
              <X size={16} />
            </ArkDialog.CloseTrigger>
          </div>
          <ArkDialog.Description className={styles.description}>{description}</ArkDialog.Description>
          {children}
        </ArkDialog.Content>
      </ArkDialog.Positioner>
    </Portal>
  </ArkDialog.Root>
);
