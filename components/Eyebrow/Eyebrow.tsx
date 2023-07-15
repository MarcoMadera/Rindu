import React, { PropsWithChildren, ReactElement } from "react";

interface EyebrowProps {
  size?: "small" | "medium" | "large";
}

const eyebrowStyles: Record<
  Required<EyebrowProps>["size"],
  React.CSSProperties
> = {
  small: {
    fontSize: "12px",
    marginBottom: "0px",
    fontWeight: "400",
    color: "#e5e5e5",
  },
  medium: {
    fontSize: "0.95rem",
    marginBottom: "5px",
    fontWeight: "400",
    color: "#fff",
  },
  large: {
    fontSize: "1.5rem",
    marginBottom: "12px",
    fontWeight: "700",
    color: "#fff",
  },
};

export default function Eyebrow({
  children,
  size = "small",
}: PropsWithChildren<EyebrowProps>): ReactElement {
  const eyebrowStyle = eyebrowStyles[size] || eyebrowStyles.large;

  return (
    <p
      className="eyebrow"
      style={{
        fontSize: eyebrowStyle.fontSize,
        marginBottom: eyebrowStyle.marginBottom,
        fontWeight: eyebrowStyle.fontWeight,
        color: eyebrowStyle.color,
      }}
    >
      {children}
      <style jsx>
        {`
          .eyebrow {
            margin-top: 4px;
            padding: 0.08em 0px;
          }
        `}
      </style>
    </p>
  );
}
