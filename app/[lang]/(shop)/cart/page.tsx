import { getLocale } from "next-intl/server";

import Cart from "./_components/Cart";
import { getFreeShipping } from "./action";

const CartPage = async () => {
  const locale = await getLocale();
  const { freeShipping } = await getFreeShipping(locale.toUpperCase());

  return <Cart freeShipping={freeShipping} />;
};

export default CartPage;
