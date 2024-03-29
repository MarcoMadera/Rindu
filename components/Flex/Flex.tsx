import { PropsWithChildren, ReactElement } from "react";

export default function Flex({
  children,
}: Readonly<PropsWithChildren>): ReactElement {
  return (
    <div>
      {children}
      <style jsx>{`
        div {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
}
