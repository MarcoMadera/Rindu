import { ReactElement } from "react";

export default function ExternalLink({
  fill,
  ...props
}: {
  fill?: string;
  [x: string]: string | number | boolean | undefined;
}): ReactElement {
  return (
    <svg viewBox="0 0 16 16" {...props}>
      <path
        fill={fill}
        fillRule="evenodd"
        d="M15 7V1H9v1h4.29L7.11 8.18l.71.71L14 2.71V7h1zM1 15h12V9h-1v5H2V4h5V3H1v12z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
