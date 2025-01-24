import { isValidElement, ReactNode } from "react";

import { getElementProps } from "./getElementProps";

export const extractTextFromChildren = (child: ReactNode): string => {
  if (typeof child === "string") {
    return child;
  }

  if (Array.isArray(child)) {
    return child.map(extractTextFromChildren).join("");
  }

  if (isValidElement(child)) {
    const props = getElementProps(child);
    return extractTextFromChildren(props?.children);
  }

  return "";
};
