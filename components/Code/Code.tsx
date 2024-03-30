import { PropsWithChildren, ReactElement } from "react";

export default function Code({
  children,
}: Readonly<PropsWithChildren>): ReactElement {
  return (
    <code>
      {children}
      <style jsx>{`
        code {
          background: #ffffff1a;
          color: #c3c3c3;
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 90%;
        }
      `}</style>
    </code>
  );
}
