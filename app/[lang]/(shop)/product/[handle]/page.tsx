import { getClient } from "@whiteeespace/core/utils";
import { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";
import { Product, WithContext } from "schema-dts";

import { GetProductQuery, GetProductQueryVariables } from "@/gql/graphql";
import { redirect } from "@utils/navigation";
import { GET_PRODUCT } from "@utils/queries/get-product";

import { ProductProvider } from "./_components/ProductProvider";
import { ProductView } from "./_components/ProductView";
import { getFreeShipping, getProduct } from "./action";

export async function generateMetadata({ params }, parent: ResolvingMetadata): Promise<Metadata> {
  const handle = String(params.handle);
  const client = getClient();
  const result = await client.query<GetProductQuery, GetProductQueryVariables>(GET_PRODUCT, {
    handle: handle,
  });

  const product = result.data?.product;

  if (!product) {
    return {};
  }

  // optionally access and extend (rather than replace) parent metadata
  const images = product.images.edges.map((image) => image.node.url);
  const parentFields = await parent;

  return {
    title: `Club Theos · ${product.title}`,
    description: product.description,
    openGraph: {
      images,
    },
    metadataBase: parentFields.metadataBase,
    ...parentFields.robots,
  };
}

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

  const jsonLd: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.edges.map((image) => image.node.url),
    description: product.description,
    productID: product.id,
    manufacturer: "Club Theos",
    category: "Clothing",
    audience: {
      "@type": "PeopleAudience",
      suggestedMinAge: 13.0,
    },
    offers: {
      "@type": "Offer",
      price: product.priceRange.minVariantPrice.amount,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      availability: "https://schema.org/InStock",
      availableDeliveryMethod: "https://schema.org/ParcelService",
    },
  };

  const sizeGuide = product.sizeGuide?.value;
  const condition = product.condition?.value;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductProvider data={product}>
        <ProductView freeShipping={freeShipping} sizeGuide={sizeGuide} condition={condition} />
      </ProductProvider>
    </>
  );
};

export default ProductPage;
