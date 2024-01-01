import { isValidElement, ReactNode, ReactPortal } from "react";

export const extractTextFromChildren = (child: ReactNode): string => {
  if (typeof child === "string") {
    return child;
  }

  if (Array.isArray(child)) {
    return child.map(extractTextFromChildren).join("");
  }

  if (isValidElement(child) && "props" in child && "children" in child.props) {
    return extractTextFromChildren((child?.props as ReactPortal)?.children);
  }

  return "";
};
