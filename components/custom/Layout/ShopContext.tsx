"use client";

import React, { PropsWithChildren, createContext, useState } from "react";

export interface ShopVariables {
  after?: string;
}

interface ShopContextProps {
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentCollection: string;
  setCurrentCollection: React.Dispatch<React.SetStateAction<string>>;
  releaseCollectionHandle: string | null;
  shopVariables: ShopVariables[];
  setShopVariables: React.Dispatch<React.SetStateAction<ShopVariables[]>>;
  scrollPosition: number;
  setScrollPosition: React.Dispatch<React.SetStateAction<number>>;
}

// Default context values - these are placeholders that get replaced by provider values
const noop = () => {
  /* placeholder */
};

export const ShopContext = createContext<ShopContextProps>({
  isSearchOpen: false,
  setIsSearchOpen: noop,
  currentCollection: "shop-all",
  setCurrentCollection: noop,
  releaseCollectionHandle: null,
  shopVariables: [],
  setShopVariables: noop,
  scrollPosition: 0,
  setScrollPosition: noop,
});

interface ShopProviderProps extends PropsWithChildren {
  releaseCollectionHandle?: string | null;
  defaultCollection?: string;
}

export const ShopProvider: React.FC<ShopProviderProps> = ({
  children,
  releaseCollectionHandle = null,
  defaultCollection = "shop-all",
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [currentCollection, setCurrentCollection] = useState<string>(defaultCollection);
  const [shopVariables, setShopVariables] = useState<ShopVariables[]>([{ after: undefined }]);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  return (
    <ShopContext.Provider
      value={{
        isSearchOpen,
        setIsSearchOpen,
        currentCollection,
        setCurrentCollection,
        releaseCollectionHandle,
        shopVariables,
        setShopVariables,
        scrollPosition,
        setScrollPosition,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShopContext = () => React.useContext(ShopContext);
