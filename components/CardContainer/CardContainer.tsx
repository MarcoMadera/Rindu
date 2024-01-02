import {
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
} from "react";

export default function CardContainer({
  children,
  ...props
}: PropsWithChildren<
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
>): ReactElement {
  return (
    <section {...props}>
      {children}
      <style jsx>{`
        section {
          max-width: 1568px;
          padding: 64px;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          position: relative;
          margin: 0 auto;
        }
        section:nth-child(odd),
        section:nth-child(odd) :global(button) {
          background-color: rgb(253, 186, 239);
          color: #000;
        }
        section:nth-child(even),
        section:nth-child(even) :global(button) {
          background-color: rgb(112, 83, 120);
          color: #fff;
        }
        section:nth-child(odd) :global(div:nth-child(1)) {
          grid-column: 1 / 6;
        }
        section:nth-child(even) :global(div:nth-child(1)) {
          grid-column: 7 / 13;
          padding: 0 32px;
        }
        section:nth-child(odd) :global(div:nth-child(2)) {
          grid-column: 7 / 13;
          padding: 0 32px;
        }
        section:nth-child(even) :global(div:nth-child(2)) {
          grid-column: 1 / 6;
          grid-row: 1 / 1;
        }
        section:nth-child(odd) :global(h2) {
          color: rgb(210, 64, 230);
        }
        section:nth-child(even) :global(h2) {
          color: rgb(255, 205, 210);
        }
        section :global(h2) {
          font-size: 48px;
          letter-spacing: -0.1rem;
          line-height: 64px;
          font-weight: 900;
        }
        section :global(p) {
          font-size: 18px;
          font-weight: 400;
          letter-spacing: 0.6px;
          word-spacing: 1.4px;
          line-height: 1.6;
        }
        section :global(button) {
          margin: 32px 0 0 0;
          font-size: 16px;
          font-weight: 500;
          display: block;
        }
        @media screen and (min-width: 0px) and (max-width: 1100px) {
          section {
            display: block;
            padding: 20px;
          }
          section:nth-child(odd) :global(div:nth-child(1)) {
            padding: 0 32px;
          }
          section:nth-child(odd) :global(div:nth-child(2)) {
            padding: 0;
          }
        }
      `}</style>
    </section>
  );
}
