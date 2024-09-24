"use client";

import { useQuery } from "@whiteeespace/core";
import Head from "next/head";
import React, { Suspense, useEffect, useState } from "react";

import { GET_BLOG } from "@/lib/queries/get-blog";
import Loader from "@theos/Loader";
import useInfiniteScroll from "@utils/hooks/use-infinite-scroll";

import { BlogItem } from "./_components/BlogItem";
import styles from "./styles.module.scss";

interface BlogVariables {
  after?: string;
}

interface BlogResultsProps {
  variables: BlogVariables;
  onLoadMore: (after: string) => void;
  isLastPage: boolean;
  onEndReached: () => void;
}

const BlogResults: React.FC<BlogResultsProps> = ({ onLoadMore, variables, isLastPage, onEndReached }) => {
  const [{ data, fetching }] = useQuery({
    query: GET_BLOG,
    variables,
  });
  const blogResults = data?.blog;

  useInfiniteScroll(
    () => onLoadMore(blogResults?.pageInfo.endCursor ?? ""),
    fetching,
    !!blogResults?.pageInfo.hasNextPage,
    isLastPage
  );

  useEffect(() => {
    if (!blogResults?.pageInfo.hasNextPage) {
      onEndReached();
    }
  }, [blogResults?.pageInfo.hasNextPage, isLastPage, onEndReached]);

  if (fetching) {
    return null;
  }

  return <>{blogResults?.nodes.map((node) => <BlogItem key={node.id} blog={node} />)}</>;
};

const BlogPage: React.FC = () => {
  const [blogVariables, setBlogVariables] = useState<BlogVariables[]>([{ after: undefined }]);
  const [showLoader, setShowLoader] = useState(true);

  return (
    <div>
      <Head>
        <title>Club Theos · Blog</title>
        <meta name="description" content="Club Theos Inc. Blog. A mood board." />
      </Head>
      <section className={styles["blog-container"]}>
        {blogVariables.map((variables, index) => (
          <Suspense key={index} fallback={null}>
            <BlogResults
              variables={variables}
              onLoadMore={(after) => setBlogVariables([...blogVariables, { after }])}
              isLastPage={blogVariables.length - 1 === index}
              onEndReached={() => setShowLoader(false)}
            />
          </Suspense>
        ))}
        {showLoader && <Loader />}
      </section>
    </div>
  );
};

export default BlogPage;
