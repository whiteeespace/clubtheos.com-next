import { getLocale } from "next-intl/server";

import { getFreeShipping } from "@/lib/data";

import Cart from "./_components/Cart";

const CartPage = async () => {
  const locale = await getLocale();
  const { freeShipping } = await getFreeShipping(locale.toUpperCase());

  return <Cart freeShipping={freeShipping} />;
};

export default CartPage;
