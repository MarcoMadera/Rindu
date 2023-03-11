import { ReactElement } from "react";

export default function NextTrack({
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
        d="M11 3v4.119L3 2.5v11l8-4.619V13h2V3z"
      ></path>
    </svg>
  );
}
