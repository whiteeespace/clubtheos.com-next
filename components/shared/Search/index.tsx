"use client";

import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { usePathname, useRouter } from "@utils/navigation";

import styles from "./Search.module.scss";
import Button from "../Button";

type FormValues = {
  search: string;
};

interface Props {
  isAlwaysOpen?: boolean;
  autoFocus?: boolean;
  showInput?: boolean;
  setShowInput?: (showInput: boolean) => void;
  placeHolder?: string;
  className?: string;
}

const Search: React.FC<Props> = ({
  showInput = false,
  autoFocus = false,
  setShowInput,
  isAlwaysOpen,
  placeHolder,
  className,
}) => {
  const t = useTranslations("navigation");
  const router = useRouter();
  const pathname = usePathname();
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { search: "" },
  });
  const onSubmit: SubmitHandler<FormValues> = (data) => onSearch(data.search);
  const openSearch = useCallback(() => {
    reset();
    setShowInput?.(true);
  }, [reset, setShowInput]);

  const onSearch = useCallback(
    (search: string) => {
      const params = new URLSearchParams();
      params.set("q", search);
      router.push(`/search?${params.toString()}`);
    },
    [router]
  );

  useEffect(() => {
    if (!pathname.includes("/search")) {
      setShowInput?.(false);
    }
  }, [pathname, setShowInput]);

  if (!showInput && !isAlwaysOpen) {
    return (
      <Button variant="secondary" onClick={openSearch}>
        <div className={styles["search-text"]}>{t("search.button")}</div>
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className={classNames(styles["content"], className)}>
        <input
          className={styles["search-input"]}
          {...register("search")}
          autoFocus={autoFocus}
          placeholder={placeHolder}
          autoComplete={"off"}
          type={"text"}
        />
        <Button type="submit" variant="secondary">
          <div className={styles["search-text"]}>{t("search.button")}</div>
        </Button>
      </div>
    </form>
  );
};

export default Search;
