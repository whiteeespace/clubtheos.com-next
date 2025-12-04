import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { Product, WithContext } from "schema-dts";

import { getProduct, getFreeShipping } from "@/lib/data";

import { ProductProvider } from "./_components/ProductProvider";
import { ProductView } from "./_components/ProductView";

export async function generateMetadata(
  { params }: { params: Promise<{ handle: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { handle } = await params;
  const locale = await getLocale();
  const { product } = await getProduct(handle, locale.toUpperCase(), "CA");

  if (!product) {
    return {};
  }

  const images = product.images.edges.map((image) => image.node.url as string);
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

const ProductPage = async ({ params }: { params: Promise<{ handle: string }> }) => {
  const { handle } = await params;
  const locale = await getLocale();

  if (!handle) {
    redirect(`/${locale}`);
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
    image: product.images.edges.map((image) => image.node.url as string),
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Shopify Decimal scalar is typed as any
      price: product.priceRange.minVariantPrice.amount,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      availability: "https://schema.org/InStock",
      availableDeliveryMethod: "https://schema.org/ParcelService",
    },
  };

  const sizeGuide = product.sizeGuide?.value;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
