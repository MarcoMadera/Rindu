import { ReactElement } from "react";

export default function Pause({
  fill,
  ...props
}: {
  fill?: string | number;
  [x: string]: string | number | undefined;
}): ReactElement {
  return (
    <svg height="16" width="16" viewBox="0 0 16 16" {...props}>
      <path fill="transparent" d="M0 0h16v16H0z"></path>
      <path
        fill={(fill as string) ?? "#000"}
        d="M3 2h3v12H3zm7 0h3v12h-3z"
      ></path>
    </svg>
  );
}
