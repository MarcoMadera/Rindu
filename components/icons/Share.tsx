import { ReactElement, SVGProps } from "react";

export default function Share(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg role="img" height="24" width="24" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M3 8a1 1 0 011-1h3.5v2H5v11h14V9h-2.5V7H20a1 1 0 011 1v13a1 1 0 01-1 1H4a1 1 0 01-1-1V8z"
      ></path>
      <path
        fill="currentColor"
        d="M12 12.326a1 1 0 001-1V3.841l1.793 1.793a1 1 0 101.414-1.414L12 .012 7.793 4.22a1 1 0 101.414 1.414L11 3.84v7.485a1 1 0 001 1z"
      ></path>
    </svg>
  );
}
