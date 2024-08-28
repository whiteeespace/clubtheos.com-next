"use client";

import {
  Button,
  Image,
  AddToCartButton,
  BuyNowButton,
  ProductPrice,
  flattenConnection,
  useProduct,
} from "@whiteeespace/core";

export const ProductView = () => {
  const { product, selectedVariant } = useProduct();
  if (!product) {
    return <></>;
  }

  const productImages = flattenConnection(product.images);
  return (
    <div>
      <p>{product.title}</p>
      <Image src={productImages[0]?.url} alt={`product-image-${0}`} />
      <p>{product.description}</p>
      <ProductPrice data={product} />
      <AddToCartButton // @ts-expect-error typing issues with shopify
        as={Button}
        variantId={selectedVariant?.id}
      >
        <Button />
      </AddToCartButton>
      {selectedVariant?.id && (
        <BuyNowButton // @ts-expect-error typing issues with shopify
          as={Button}
          variant={"secondary"}
          variantId={selectedVariant.id}
        >
          buy now
        </BuyNowButton>
      )}
    </div>
  );
};
