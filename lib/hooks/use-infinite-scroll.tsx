"use client";

import { debounce } from "lodash";
import { useEffect } from "react";

const useInfiniteScroll = (
  fetchNextPage: () => void,
  isBlogLoading: boolean,
  hasNextPage: boolean,
  isLastPage: boolean
) => {
  useEffect(() => {
    if (!isLastPage) {
      return;
    }

    const handleScroll = debounce(() => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 50 && !isBlogLoading && hasNextPage) {
        fetchNextPage();
      }
    }, 200);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage, isBlogLoading, isLastPage]);
};

export default useInfiniteScroll;
