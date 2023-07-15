import { ReactElement } from "react";

export default function ExplicitSign(): ReactElement {
  return (
    <div>
      <small>E</small>
      <style jsx>{`
        small {
          font-size: 10px;
          font-weight: bold;
          color: #463f3f;
          font-family: "Lato", sans-serif;
        }
        div {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          background-color: #d2d2d2;
          width: 17px;
          height: 17px;
          margin-right: 4px;
        }
      `}</style>
    </div>
  );
}
