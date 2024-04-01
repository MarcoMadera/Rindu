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
      <div className="app-footer"></div>
      <style jsx>{`
      main {
          display: block;
          margin: ${hasPageHeader ? "0 auto 0 auto" : "60px auto"};
          padding: ${hasPageHeader ? "0" : "0px 20px 30px"};
          min-height: calc((var(--vh, 1vh) * 100) - 90px);
          width: 100%;
          background: #121212;
        }
        .app-footer {
          height: 1px;
        }
        @media (max-width: 1000px) {
          main {
            width: 100vw;
            margin: ${hasPageHeader ? "0 0 0 0" : "60px auto"};
          }
        }
        @media screen and (max-width: 768px) {
          main {
          padding: ${hasPageHeader ? "0" : "0px 0px 30px"};
          }
        }
      }
      `}</style>
    </main>
  );
}
