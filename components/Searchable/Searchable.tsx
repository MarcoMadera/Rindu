import React, { Children, PropsWithChildren, ReactElement } from "react";

import TextHighlighter from "components/TextHighlighter";
import { extractTextFromChildren } from "utils";

export default function Searchable({
  searchTerm,
  children,
}: PropsWithChildren<{ searchTerm: string }>): ReactElement {
  return (
    <>
      {Children.map(children, (child) => {
        const text = extractTextFromChildren(child);
        if (!searchTerm) return child;

        if (
          searchTerm &&
          text &&
          text.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return <TextHighlighter text={searchTerm}>{child}</TextHighlighter>;
        }

        return null;
      })}
    </>
  );
}
