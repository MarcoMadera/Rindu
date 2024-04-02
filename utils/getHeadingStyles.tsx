import { ReactElement } from "react";

import css from "styled-jsx/css";

import type { AsType, Heading, HeadingStyles } from "types/heading";
import { Color } from "types/heading";

const fontSizes = ["6em", "2.1em", "1.5em", "1.25em", "1em", "0.75em"];
const fontSizesMobile = ["4em", "1.8em", "1.3em", "1em", "0.8em", "0.6em"];
const lineHeights = ["100px", "40px", "30px", "24px", "20px", "16px"];
const lineHeightsMobile = ["60px", "30px", "20px", "16px", "12px", "8px"];

export function getHeadingStyles(
  number: number,
  element: AsType | Heading,
  { color, fontSize, margin, textAlign, multiline }: HeadingStyles
): {
  className: string;
  styles: ReactElement;
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

    @media (max-width: 768px) {
      ${element} {
        font-size: ${fontSizesMobile[number - 1]};
        line-height: ${lineHeightsMobile[number - 1]};
        padding: 0 8px;
      }
    }
  `;
}
