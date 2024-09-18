import { Fragment } from "react";
import { formatMultilineText } from "utils/format";

interface Props {
  text?: string;
}

export const MultilineText: React.FC<Props> = ({ text }) => {
  const textArray = formatMultilineText(text);
  return (
    <>
      {textArray?.map((text) => (
        <Fragment key={text.slice(10)}>
          <p>{text}</p>
          <br />
        </Fragment>
      ))}
    </>
  );
};
