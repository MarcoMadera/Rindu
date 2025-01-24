import { JSXElementConstructor, ReactElement, ReactNode } from "react";

type ElementProps = {
  children?: ReactNode;
} & Record<string, unknown>;

const isElementProps = (props: unknown): props is ElementProps => {
  return typeof props === "object" && props !== null;
};

export const getElementProps = (
  child: ReactElement<unknown, string | JSXElementConstructor<any>>
): ElementProps => {
  if (!isElementProps(child.props)) {
    return { children: undefined };
  }
  return child.props;
};
