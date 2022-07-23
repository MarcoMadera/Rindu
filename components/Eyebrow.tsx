import React, { PropsWithChildren, ReactElement } from "react";

interface EyebrowProps {
  size?: "small" | "medium" | "large";
}

export function Eyebrow({
  children,
  size = "small",
}: PropsWithChildren<EyebrowProps>): ReactElement {
  return (
    <p className="eyebrow">
      {children}
      <style jsx>
        {`
          .eyebrow {
            font-size: ${size === "small"
              ? "12px"
              : size === "medium"
              ? "0.95rem"
              : "1.5rem"};
            margin-top: 4px;
            margin-bottom: ${size === "small"
              ? "0px"
              : size === "medium"
              ? "5px"
              : "12px"};
            font-weight: ${size === "medium" ? "400" : "700"};
            color: ${size === "small" ? "#e5e5e5" : "#fff"};
            padding: 0.08em 0px;
          }
        `}
      </style>
    </p>
  );
}
