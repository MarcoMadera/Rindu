import {
  createElement,
  DetailedHTMLProps,
  HtmlHTMLAttributes,
  PropsWithChildren,
  ReactElement,
} from "react";
import type { HeadingProps } from "types/heading";
import { getHeadingStyles } from "utils/getHeadingStyles";

export default function Heading({
  number,
  as: element = `h${number}`,
  color,
  fontSize,
  margin,
  textAlign,
  children,
  ...props
}: PropsWithChildren<HeadingProps> &
  DetailedHTMLProps<
    HtmlHTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >): ReactElement {
  const { className, styles } = getHeadingStyles(number, element, {
    color,
    fontSize,
    margin,
    textAlign,
  });

  return (
    <>
      {createElement(element, { className, ...props }, children)}
      {styles}
    </>
  );
}
