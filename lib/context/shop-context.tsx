"use client";

import { createContext, useContext, ReactNode } from "react";

interface ShopContextValue {
  releaseCollectionHandle: string | null;
  /** Navbar logo links to home (collection grid) instead of the first collection. */
  multiCollectionReleaseActive: boolean;
}

const ShopContext = createContext<ShopContextValue>({
  releaseCollectionHandle: null,
  multiCollectionReleaseActive: false,
});

export function useShopContext() {
  return useContext(ShopContext);
}

interface ShopProviderProps {
  releaseCollectionHandle: string | null;
  multiCollectionReleaseActive?: boolean;
  children: ReactNode;
}

export function ShopProvider({
  releaseCollectionHandle,
  multiCollectionReleaseActive = false,
  children,
}: ShopProviderProps) {
  return (
    <ShopContext.Provider value={{ releaseCollectionHandle, multiCollectionReleaseActive }}>
      {children}
    </ShopContext.Provider>
  );
}
