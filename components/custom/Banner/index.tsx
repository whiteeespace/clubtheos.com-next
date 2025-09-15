"use client";

import { useQuery } from "@whiteeespace/core";
import { parseMetaobject, ValueMetaobject } from "@whiteeespace/core/utils";
import classNames from "classnames";
import { useLocale } from "next-intl";
import Marquee from "react-fast-marquee";

import { GET_BANNER } from "@utils/queries/get-banner";
import { LanguageCode } from "gql/graphql";

import styles from "./styles.module.scss";

interface Props {
  className?: string;
}

const Banner: React.FC<Props> = ({ className }) => {
  const locale = useLocale();

  const [result] = useQuery({
    query: GET_BANNER,
    variables: { language: locale.toUpperCase() as LanguageCode },
  });
  const banner = parseMetaobject<ValueMetaobject>(result?.data?.metaobject?.text);
  const show = parseMetaobject<ValueMetaobject>(result?.data?.metaobject?.show);

  if (show?.value === "false" || !banner) {
    return null;
  }

  return (
    <div className={classNames(styles["banner"], className)}>
      <Marquee speed={10}>
        <div className={styles["banner-marquee"]}>
          {Array(12)
            .fill(0)
            .map((_, ind) => (
              <p key={ind}>{banner.value}</p>
            ))}
        </div>
      </Marquee>
    </div>
  );
};

export default Banner;
