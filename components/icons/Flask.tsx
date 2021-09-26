import { ReactElement, SVGProps } from "react";

export function Flask(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        d="M13 6h1V5a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v1h1v2.072L4.285 17.97A2 2 0 0 0 6 21h11a2 2 0 0 0 1.715-3.03L13 8.072V6zM6 22a3 3 0 0 1-2.516-4.635L9 7.811V7a1 1 0 0 1-1-1V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1v.811l5.516 9.554A3 3 0 0 1 17 22H6zm6.294-6.708l1.626-1.626L17 19H6l3.66-6.34l2.634 2.632zm0 1.414l-2.419-2.418L7.732 18h7.536l-1.562-2.706l-1.412 1.412zM12 10a1 1 0 1 1 0 2a1 1 0 0 1 0-2z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
