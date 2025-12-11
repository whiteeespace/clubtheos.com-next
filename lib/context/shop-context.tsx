"use client";

import { createContext, useContext, ReactNode } from "react";

interface ShopContextValue {
  releaseCollectionHandle: string | null;
}

const ShopContext = createContext<ShopContextValue>({ releaseCollectionHandle: null });

export function useShopContext() {
  return useContext(ShopContext);
}

interface ShopProviderProps {
  releaseCollectionHandle: string | null;
  children: ReactNode;
}

export function ShopProvider({ releaseCollectionHandle, children }: ShopProviderProps) {
  return <ShopContext.Provider value={{ releaseCollectionHandle }}>{children}</ShopContext.Provider>;
}
