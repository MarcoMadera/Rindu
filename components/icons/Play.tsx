import { ReactElement } from "react";

export default function Play({
  ...props
}: {
  [x: string]: string | number;
}): ReactElement {
  return (
    <svg height="16" width="16" viewBox="0 0 24 24" {...props}>
      <path
        fill={(props.fill as string) ?? "#000"}
        d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"
      ></path>
    </svg>
  );
}
