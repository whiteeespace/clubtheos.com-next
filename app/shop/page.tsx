import { flattenConnection, getClient } from "@whiteeespace/core/utils";
import classNames from "classnames";
import Link from "next/link";

import Item from "@components/Item";
import { GET_COLLECTION } from "@utils/queries/get-collection";
import { GetCollectionQuery, GetCollectionQueryVariables } from "gql/graphql";

import styles from "./styles.module.scss";

const ShopPage = async () => {
  const client = getClient();
  const result = await client.query<GetCollectionQuery, GetCollectionQueryVariables>(GET_COLLECTION, {
    collectionHandle: "shop-all",
  });

  const collection = result.data?.collection;

  if (!collection?.products) {
    return <></>;
  }

  const products = flattenConnection(collection?.products);

  return (
    <>
      <div className={classNames(styles["products"])}>
        {products.map((product) => (
          <Link href={`/product/${product.handle}`} key={product.handle}>
            <Item product={product} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default ShopPage;
