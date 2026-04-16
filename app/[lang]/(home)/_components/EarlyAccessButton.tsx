"use client";

import { Popover, Portal } from "@ark-ui/react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import Button from "@theos/Button";
import { useRouter } from "@utils/navigation";

import styles from "../styles.module.scss";

interface Props {
  expectedPassword?: string | null;
  /** After unlock: navigate to this path. `null` = stay on this page and refresh (e.g. multi-collection home grid). */
  redirectTo?: string | null;
}

export const EarlyAccessButton: React.FC<Props> = ({ expectedPassword, redirectTo }) => {
  const t = useTranslations("metadata.home");
  const router = useRouter();
  const [open, setOpen] = useState(false);

  interface FormValues {
    password: string;
  }
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { password: "" },
  });

  function grantEarlyAccess(password: string) {
    // Session cookie - expires when browser closes, so users re-enter on revisit
    // Using effect-like pattern to satisfy React Compiler
    queueMicrotask(() => {
      document.cookie = `theos_early_access=${password}; path=/`;
      if (redirectTo === null) {
        router.refresh();
      } else {
        router.push(redirectTo ?? "/shop");
      }
    });
  }

  const onSubmit = ({ password }: FormValues) => {
    if (!expectedPassword) {
      setError("password", { type: "manual", message: t("no_password_available") });
      return;
    }
    if (password.trim() === expectedPassword.trim()) {
      grantEarlyAccess(password);
      reset();
      setOpen(false);
    } else {
      setError("password", { type: "manual", message: t("invalid_password") });
    }
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      positioning={{ placement: "bottom-end", gutter: 12 }}
      closeOnInteractOutside={true}
      closeOnEscape={true}
    >
      <Popover.Trigger asChild>
        <Button variant="link" className={styles.button}>
          {t("get_early_access")}
        </Button>
      </Popover.Trigger>
      {open && (
        <Portal>
          <Popover.Positioner className={styles["early-access-positioner"]}>
            <Popover.Content className={styles["early-access-popover"]}>
              <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className={styles["early-access-form"]}>
                <input
                  type="password"
                  placeholder={t("password_placeholder")}
                  className={classNames(styles["early-access-input"], {
                    [styles["early-access-input-error"]]: errors.password?.message,
                  })}
                  {...register("password", { required: t("no_password_available") })}
                />
                <Button type="submit" className={styles["early-access-submit"]} disabled={isSubmitting}>
                  {t("submit")}
                </Button>
              </form>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      )}
    </Popover.Root>
  );
};
