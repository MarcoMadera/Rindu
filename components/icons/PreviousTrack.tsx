import { ReactElement } from "react";

export default function PreviousTrack({
  fill,
  ...props
}: {
  fill?: string | number;
  [x: string]: string | number | undefined;
}): ReactElement {
  return (
    <svg height="16" width="16" viewBox="0 0 16 16" {...props}>
      <path
        fill={fill as string}
        d="M13 2.5L5 7.119V3H3v10h2V8.881l8 4.619z"
      ></path>
    </svg>
  );
}
