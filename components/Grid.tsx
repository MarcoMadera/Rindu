import { PropsWithChildren, ReactElement } from "react";

export default function Grid({ children }: PropsWithChildren): ReactElement {
  return (
    <div>
      {children}
      <style jsx>{`
        div {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          grid-gap: 24px;
          justify-content: space-between;
          margin-top: 20px;
          grid-template-rows: 1fr;
        }
      `}</style>
    </div>
  );
}
