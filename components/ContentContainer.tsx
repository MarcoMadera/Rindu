import {
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
} from "react";

interface ContentContainerProps {
  hasPageHeader?: boolean;
}

export default function ContentContainer({
  children,
  hasPageHeader,
}: PropsWithChildren<ContentContainerProps> &
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>): ReactElement {
  return (
    <main>
      {children}
      <style jsx>{`
      main {
          display: block;
          margin: ${hasPageHeader ? "-60px auto 0 auto" : "0 auto"};
          padding: ${hasPageHeader ? "0" : "0px 20px 30px"};
          min-height: calc((var(--vh, 1vh) * 100) - 90px);
          width: 100%;
          background: #121212;
        }
        @media (max-width: 1000px) {
          main {
            width: 100vw;
            margin: ${hasPageHeader ? "-60px 0 0 0" : "0"};
          }
        }
      }
      `}</style>
    </main>
  );
}
