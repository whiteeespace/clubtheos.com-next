"use client";

import type { DocumentNode } from "graphql";
import { print } from "graphql";
import { useCallback, useEffect, useRef, useState } from "react";

import { API_VERSION } from "@/lib/consts";

interface UseShopifyQueryResult<TData> {
  data: TData | undefined;
  fetching: boolean;
  error: Error | undefined;
  refetch: () => void;
}

interface UseShopifyQueryOptions {
  pause?: boolean;
}

const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_ID
  ? `https://${process.env.NEXT_PUBLIC_STOREFRONT_ID}.myshopify.com/api/${API_VERSION}/graphql.json`
  : "";

const storefrontToken = process.env.NEXT_PUBLIC_STOREFRONT_API_TOKEN ?? "";

async function executeQuery<TData, TVariables>(
  query: DocumentNode,
  variables?: TVariables
): Promise<TData> {
  const response = await fetch(storefrontUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
    body: JSON.stringify({
      query: print(query),
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront API request failed: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as { data?: TData; errors?: unknown };

  if (json.errors) {
    throw new Error(`Shopify Storefront API errors: ${JSON.stringify(json.errors)}`);
  }

  if (!json.data) {
    throw new Error("Shopify Storefront API response missing data");
  }

  return json.data;
}

/**
 * Hook for client-side Shopify Storefront API queries.
 * Replaces URQL's useQuery with a simpler fetch-based approach.
 */
export function useShopifyQuery<TData, TVariables extends Record<string, unknown> = Record<string, unknown>>(
  query: DocumentNode,
  variables?: TVariables,
  options?: UseShopifyQueryOptions
): UseShopifyQueryResult<TData> {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  // Use a ref to track if we're mounted to avoid state updates after unmount
  const isMountedRef = useRef(true);

  // Serialize variables for dependency comparison
  const variablesKey = JSON.stringify(variables);

  const fetchData = useCallback(async () => {
    if (options?.pause) return;

    setFetching(true);
    setError(undefined);

    try {
      const result = await executeQuery<TData, TVariables>(query, variables);
      if (isMountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (isMountedRef.current) {
        setFetching(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, variablesKey, options?.pause]);

  useEffect(() => {
    isMountedRef.current = true;
    void fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    void fetchData();
  }, [fetchData]);

  return {
    data,
    fetching,
    error,
    refetch,
  };
}

