import { flattenConnection } from "@shopify/hydrogen-react";
import {
  Collection,
  Image,
  MetaobjectField,
  Product,
  VideoSource,
} from "@shopify/hydrogen-react/storefront-api-types";
import { PartialDeep } from "type-fest";

/**
 * Parses a metaobject field and returns a generic object with the correct shape
 * @param metaobjectField The metaobject field to parse
 * @returns A generic object with the correct shape
 */

export function parseMetaobject<ReturnGeneric>(
  metaobjectField: PartialDeep<MetaobjectField, { recurseIntoArrays: true }> | null | undefined
): ReturnGeneric {
  if (!metaobjectField) {
    return {} as ReturnGeneric;
  }

  if (!metaobjectField.reference && !metaobjectField.references) {
    return {
      value: metaobjectField.value ?? undefined,
    } as ReturnGeneric;
  }

  switch (metaobjectField.reference?.__typename) {
    case "MediaImage":
      return {
        image: metaobjectField.reference.image,
      } as ReturnGeneric;
    case "Video":
      return {
        sources: metaobjectField.reference.sources ?? undefined,
      } as ReturnGeneric;
    case "Collection":
      return {
        collection: metaobjectField.reference,
      } as ReturnGeneric;
    case "Product":
      return {
        product: metaobjectField.reference,
      } as ReturnGeneric;
  }

  const references =
    metaobjectField?.references && flattenConnection(metaobjectField?.references ?? undefined);

  const parsedReferences = references?.map((reference) => {
    switch (reference?.__typename) {
      case "MediaImage":
        return {
          image: reference.image,
        } as ReturnGeneric;
      case "Video":
        return {
          sources: reference.sources ?? undefined,
        } as ReturnGeneric;
      case "Collection":
        return {
          collection: reference,
        } as ReturnGeneric;
      case "Product":
        return {
          product: reference,
        } as ReturnGeneric;
    }
  });

  if (parsedReferences) {
    return {
      references: parsedReferences,
    } as ReturnGeneric;
  }

  return {
    value: metaobjectField.value ?? undefined,
  } as ReturnGeneric;
}

export interface ImageMetaobject {
  image?: Image;
}

export interface VideoMetaobject {
  sources?: VideoSource[];
}

export interface CollectionMetaobject {
  collection?: Collection;
}

export interface ProductMetaobject {
  product?: Product;
}

export interface ValueMetaobject {
  value?: string;
}

export interface ReferencesMetaobject<GenericType> {
  references?: GenericType[];
}
