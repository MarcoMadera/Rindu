import { ReactElement } from "react";

export function Play({
  ...props
}: {
  [x: string]: string | number;
}): ReactElement {
  return (
    <svg height="16" width="16" viewBox="0 0 16 16" {...props}>
      <path
        fill={(props.fill as string) ?? "#000"}
        d="M4.018 14L14.41 8 4.018 2z"
      ></path>
    </svg>
  );
}
