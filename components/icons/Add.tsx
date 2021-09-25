import { ReactElement } from "react";

export default function Add({
  ...props
}: {
  [x: string]: string | number | undefined;
}): ReactElement {
  return (
    <svg height="12" width="12" viewBox="0 0 16 16" {...props}>
      <path d="M14 7H9V2H7v5H2v2h5v5h2V9h5z"></path>
      <path fill="none" d="M0 0h16v16H0z"></path>
    </svg>
  );
}
