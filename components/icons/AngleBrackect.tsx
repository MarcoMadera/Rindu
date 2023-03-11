import { ReactElement } from "react";

export default function AngleBrackect({
  angle,
  ...props
}: {
  angle?: "greater" | "less";
  [x: string]: string | number | undefined;
}): ReactElement {
  return (
    <svg
      focusable="false"
      height="24"
      width="24"
      viewBox="0 0 24 24"
      {...props}
    >
      <polyline
        points={angle === "less" ? "16 4 7 12 16 20" : "8 4 17 12 8 20"}
        fill="none"
        stroke="#fff"
        strokeWidth="1pt"
      ></polyline>
    </svg>
  );
}
