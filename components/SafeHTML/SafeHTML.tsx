import { PropsWithChildren, ReactElement, useEffect, useState } from "react";

import DOMPurify from "isomorphic-dompurify";

interface Props {
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
}

export default function SafeHTML({
  children,
  className = "",
  allowedTags = ["p", "br", "strong", "em", "a", "span"],
  allowedAttributes = ["href", "target", "rel"],
}: PropsWithChildren<Props>): ReactElement | null {
  const [sanitizedContent, setSanitizedContent] = useState("");

  useEffect(() => {
    const spotifyUrlRegex =
      /^(?:(?:(?:f|ht)tps?|spotify):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i;

    const htmlString = children?.toString() ?? "";

    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
      if (node instanceof Element && node.tagName === "A") {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    });
    const clean = DOMPurify.sanitize(htmlString, {
      ALLOWED_URI_REGEXP: spotifyUrlRegex,
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttributes,
      ADD_ATTR: ["target:_blank", "rel:noopener noreferrer"],
    });

    setSanitizedContent(clean);
  }, [allowedAttributes, allowedTags, children]);

  if (!sanitizedContent) {
    return <span className={className} />;
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
