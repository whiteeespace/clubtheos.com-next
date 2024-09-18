import { getLocale } from "next-intl/server";

import { redirect } from "@utils/navigation";

import { ProductProvider } from "./_components/ProductProvider";
import { ProductView } from "./_components/ProductView";
import { getFreeShipping, getProduct } from "./action";

const ProductPage = async ({ params }) => {
  const handle = String(params.handle);
  const locale = await getLocale();

  if (!handle) {
    return redirect("/");
  }

  const { product } = await getProduct(handle, locale.toUpperCase(), "CA");
  const { freeShipping } = await getFreeShipping(locale.toUpperCase(), "CA");

  if (!product) {
    return <></>;
  }

  const sizeGuide = product.sizeGuide?.value;

  return (
    <ProductProvider data={product}>
      <ProductView freeShipping={freeShipping} sizeGuide={sizeGuide} />
    </ProductProvider>
  );
};

export default ProductPage;
