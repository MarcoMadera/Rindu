import {
  Children,
  cloneElement,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from "react";

interface TextHighlighterProps {
  text: string;
}

export default function TextHighlighter({
  text,
  children,
}: PropsWithChildren<TextHighlighterProps>): ReactElement {
  const highlightText = (children: ReactNode): ReactNode => {
    return Children.map(children, (child: ReactNode) => {
      if (typeof child === "string") {
        const parts = child.split(new RegExp(`(${text})`, "gi"));

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

      if (
        isValidElement(child) &&
        "props" in child &&
        "children" in child.props
      ) {
        return cloneElement(
          child,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          child.props,
          <TextHighlighter text={text}>
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
            {child?.props?.children}
          </TextHighlighter>
        );
      }

      return child;
    });
  };

  return <>{highlightText(children)}</>;
}
