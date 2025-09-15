"use client";

import { Popover, Portal } from "@ark-ui/react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Button from "@theos/Button";
import { useRouter } from "@utils/navigation";

import styles from "../styles.module.scss";

interface Props {
  expectedPassword?: string | null;
}

function useIsMobile(breakpointPx: number = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpointPx}px)`);
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, [breakpointPx]);

  return isMobile;
}

export const EarlyAccessButton: React.FC<Props> = ({ expectedPassword }) => {
  const t = useTranslations("metadata.home");
  const router = useRouter();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  type FormValues = { password: string };
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
    try {
      // Local storage for client logic
      localStorage.setItem("theos_early_access", password);
      // Cookie so server can read in RSC
      document.cookie = `theos_early_access=${password}; path=/; max-age=${7 * 24 * 60 * 60}`;
      router.push("/shop");
    } catch (err) {
      // ignore
    }
  }

  const onSubmit = async ({ password }: FormValues) => {
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
      positioning={{ placement: isMobile ? "top" : "bottom-end", gutter: 8 }}
      closeOnInteractOutside={true}
      closeOnEscape={true}
    >
      <Popover.Trigger asChild>
        <Button variant="link" className={styles["button"]}>
          {t("get_early_access")}
        </Button>
      </Popover.Trigger>
      {open && (
        <Portal>
          <Popover.Positioner>
            <Popover.Content className={styles["early-access-popover"]}>
              <form onSubmit={handleSubmit(onSubmit)} className={styles["early-access-form"]}>
                <input
                  type="password"
                  placeholder={t("password_placeholder")}
                  className={classNames(styles["early-access-input"], {
                    [styles["early-access-input-error"]]: errors.password?.message,
                  })}
                  {...register("password", { required: t("no_password_available") as string })}
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
