import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { getCollectionPageData } from "@/lib/data/get-collection-page-data";

import { CollectionContent } from "./_components/CollectionContent";

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const locale = await getLocale();
  const data = await getCollectionPageData(handle, locale.toUpperCase(), "CA");

  if (!data) {
    return { title: "Collection Not Found" };
  }

  const ogImages = data.collectionImage ? [{ url: data.collectionImage.url }] : undefined;

  return {
    title: data.title,
    description: data.description ?? undefined,
    openGraph: {
      title: data.title,
      description: data.description ?? undefined,
      images: ogImages,
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const locale = await getLocale();
  const data = await getCollectionPageData(handle, locale.toUpperCase(), "CA");

  if (!data) {
    notFound();
  }

  return <CollectionContent collection={data} />;
}
