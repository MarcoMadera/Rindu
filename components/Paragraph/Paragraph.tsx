import { DetailedHTMLProps, HTMLAttributes, ReactElement } from "react";

export default function Paragraph(
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >
): ReactElement {
  return (
    <p {...props}>
      {props.children}
      <style jsx>{`
        p {
          color: #b3b3b3;
          font-weight: 400;
          letter-spacing: -0.04em;
          margin: 0;
          white-space: pre-wrap;
          font-size: 1rem;
          line-height: 1.5rem;
          text-transform: none;
          letter-spacing: normal;
        }
      `}</style>
    </p>
  );
}
