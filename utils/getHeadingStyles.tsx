import css from "styled-jsx/css";

import type { AsType, Heading, HeadingStyles } from "types/heading";
import { Color } from "types/heading";

const fontSizes = ["96px", "2.1rem", "24px", "20px", "16px", "12px"];
const lineHeights = ["100px", "40px", "30px", "24px", "20px", "16px"];

export function getHeadingStyles(
  number: number,
  element: AsType | Heading,
  { color, fontSize, margin, textAlign, multiline }: HeadingStyles
): {
  className: string;
  styles: JSX.Element;
} {
  return css.resolve`
    ${element} {
      color: ${color ?? Color.Primary};
      font-weight: ${number === 1 ? "900" : "700"};
      font-size: ${fontSize ?? fontSizes[number - 1]};
      margin: ${margin ?? 0};
      text-align: ${textAlign ?? "left"};
      -webkit-line-clamp: ${multiline ?? 3};
      pointer-events: ${number === 1 ? "none" : "auto"};
      user-select: ${number === 1 ? "none" : "auto"};
      padding: ${number === 1 ? "0.08em 0px" : "0"};
      line-height: ${fontSize ??
      (number === 3 ? "28px" : lineHeights[number - 1])};
    }
  `;
}
