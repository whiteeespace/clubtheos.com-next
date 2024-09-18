"use client";

import { useQuery } from "@whiteeespace/core";
import React, { Suspense, useState } from "react";

import { GET_BLOG } from "@/lib/queries/get-blog";
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
}

const BlogResults: React.FC<BlogResultsProps> = ({ onLoadMore, variables, isLastPage }) => {
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

  return (
    <>
      {fetching ? (
        <div>Loading...</div>
      ) : (
        blogResults?.nodes.map((node) => <BlogItem key={node.id} blog={node} />)
      )}
    </>
  );
};

const BlogPage: React.FC = () => {
  const [blogVariables, setBlogVariables] = useState<BlogVariables[]>([{ after: undefined }]);

  return (
    <div>
      <section className={styles["blog-container"]}>
        {blogVariables.map((variables, index) => (
          <Suspense key={index} fallback={<div>Loading...</div>}>
            <BlogResults
              variables={variables}
              onLoadMore={(after) => setBlogVariables([...blogVariables, { after }])}
              isLastPage={blogVariables.length - 1 === index}
            />
          </Suspense>
        ))}
      </section>
    </div>
  );
};

export default BlogPage;
