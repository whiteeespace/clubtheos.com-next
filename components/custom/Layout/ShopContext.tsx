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
  shopVariables: ShopVariables[];
  setShopVariables: React.Dispatch<React.SetStateAction<ShopVariables[]>>;
  scrollPosition: number;
  setScrollPosition: React.Dispatch<React.SetStateAction<number>>;
}

export const ShopContext = createContext<ShopContextProps>({
  isSearchOpen: false,
  setIsSearchOpen: () => {},
  currentCollection: "",
  setCurrentCollection: () => {},
  shopVariables: [],
  setShopVariables: () => {},
  scrollPosition: 0,
  setScrollPosition: () => {},
});

export const ShopProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [currentCollection, setCurrentCollection] = useState<string>("");
  const [shopVariables, setShopVariables] = useState<ShopVariables[]>([{ after: undefined }]);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  return (
    <ShopContext.Provider
      value={{
        isSearchOpen,
        setIsSearchOpen,
        currentCollection,
        setCurrentCollection,
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
