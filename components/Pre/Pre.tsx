import { PropsWithChildren, ReactElement } from "react";

export enum WhiteSpace {
  Normal = "normal",
  Pre = "pre",
  PreLine = "pre-line",
  PreWrap = "pre-wrap",
}

interface IPre {
  whiteSpace?: WhiteSpace;
}

export default function Pre({
  children,
  whiteSpace = WhiteSpace.Pre,
}: Readonly<PropsWithChildren<IPre>>): ReactElement {
  return (
    <pre>
      {children}
      <style jsx>{`
        pre {
          background: #ffffff1a;
          color: #fff;
          display: block;
          padding: 12px;
          width: 100%;
          line-height: 1.6;
          word-break: normal;
          word-spacing: normal;
          word-wrap: normal;
        }
      `}</style>
      <style jsx>{`
        pre {
          white-space: ${whiteSpace};
        }
      `}</style>
    </pre>
  );
}
