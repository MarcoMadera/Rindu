import { PropsWithChildren, ReactElement } from "react";

export default function Kbd({
  children,
}: Readonly<PropsWithChildren>): ReactElement {
  return (
    <kbd>
      {children}
      <style jsx>{`
        kbd {
          border-radius: 4px;
          box-shadow:
            0 1px 0 rgba(0, 0, 0, 0.3),
            inset 0 0 0 1px #fff;
          box-sizing: border-box;
          color: inherit;
          display: inline-block;
          font-size: 1rem;
          font-weight: 400;
          margin: 0 4px;
          padding: 2px 8px;
        }
      `}</style>
    </kbd>
  );
}
