import css from "styled-jsx/css";
import type { AsType, Heading } from "types/heading";
import { Color } from "types/heading";

const fontSizes = ["96px", "2.1rem", "24px", "20px", "16px", "12px"];
const lineHeights = ["100px", "40px", "30px", "24px", "20px", "16px"];

export function getHeadingStyles(
  number: number,
  element: AsType | Heading,
  {
    color,
    fontSize,
    margin,
    textAlign,
  }: { color?: Color; fontSize?: string; margin?: string; textAlign?: string }
): {
  className: string;
  styles: JSX.Element;
} {
  return css.resolve`
    ${element} {
      color: ${color ?? (number === 1 ? Color.Primary : Color.Secondary)};
      display: -webkit-box;
      font-family: "Lato", "sans-serif";
      font-weight: ${number === 1 ? "900" : "700"};
      font-size: ${fontSize ?? fontSizes[number - 1]};
      letter-spacing: -0.04em;
      line-break: anywhere;
      margin: ${margin ?? 0};
      max-width: 100%;
      overflow: hidden;
      position: relative;
      text-overflow: ellipsis;
      text-transform: none;
      text-align: ${textAlign ?? "left"};
      white-space: unset;
      z-index: 999999;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      pointer-events: ${number === 1 ? "none" : "auto"};
      user-select: ${number === 1 ? "none" : "auto"};
      width: 100%;
      padding: ${number === 1 ? "0.08em 0px" : "0"};
      line-height: ${fontSize ??
      (number === 3 ? "28px" : lineHeights[number - 1])};
    }
  `;
}
