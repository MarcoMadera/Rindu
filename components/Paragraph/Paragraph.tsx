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
          margin: 0;
          white-space: pre-line;
          font-size: 1rem;
          line-height: 1.5rem;
          text-transform: none;
          letter-spacing: normal;
          max-width: 672px;
          padding-top: 16px;
          padding-right: 20px;
        }
      `}</style>
    </p>
  );
}
