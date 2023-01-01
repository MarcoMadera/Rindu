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
        @media (max-width: 768px) {
          div {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          }
        }
        @media (max-width: 420px) {
          div {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
