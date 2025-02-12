import {
  Children,
  cloneElement,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from "react";

import { escapeRegExp } from "lodash";

import { getElementProps } from "utils";

interface TextHighlighterProps {
  text: string;
}

export default function TextHighlighter({
  text,
  children,
}: PropsWithChildren<TextHighlighterProps>): ReactElement {
  if (!text) {
    return <>{children}</>;
  }

  return (
    <span>
      {Children.map(children, (child: ReactNode) => {
        if (typeof child === "string") {
          const escapedText = escapeRegExp(text);
          const parts = child.split(new RegExp(`(${escapedText})`, "gi"));

          return parts.map((part, index) =>
            part.toLowerCase() === text.toLowerCase() ? (
              <mark key={`highlight-${index}`}>
                {part}
                <style jsx>{`
                  mark {
                    background-color: #2e77d0;
                    border-radius: 4px;
                    color: #fff;
                  }
                `}</style>
              </mark>
            ) : (
              part
            )
          );
        }

        if (isValidElement(child)) {
          const props = getElementProps(child);
          if (props.children) {
            return cloneElement(
              child,
              props,
              <TextHighlighter text={text}>{props.children}</TextHighlighter>
            );
          }

          return child;
        }

        return child;
      })}
    </span>
  );
}
