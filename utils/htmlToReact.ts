import { createElement, ReactNode } from "react";

type FormatFunction = (str: string) => string | ReactNode[];

export function htmlToReact(
  htmlString: string,
  format: FormatFunction = (str) => str ?? ""
): ReactNode {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const body = doc.body;
  const div = document.createElement("div");
  Array.from(body.childNodes).forEach((child) => div.appendChild(child));
  function traverse(node: Node): ReactNode {
    if (node.nodeType === Node.TEXT_NODE) {
      return format((node as Text).textContent ?? "");
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const children = Array.from(node.childNodes).map(traverse);
      const props: Record<string, string> = {};
      Array.from((node as Element).attributes).forEach((attr) => {
        props[attr.name] = attr.value;
      });

      return createElement(
        (node as Element).tagName.toLowerCase(),
        props,
        ...children
      );
    }
    return null;
  }

  return traverse(div);
}
