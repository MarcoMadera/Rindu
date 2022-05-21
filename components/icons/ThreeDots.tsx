import { ReactElement, SVGProps } from "react";

export default function ThreeDots(
  props: SVGProps<SVGSVGElement>
): ReactElement {
  return (
    <svg height="16" width="16" viewBox="0 0 16 16" {...props}>
      <path
        fill="currentColor"
        d="M2 6.5a1.5 1.5 0 10-.001 2.999A1.5 1.5 0 002 6.5zm6 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6 0a1.5 1.5 0 10-.001 2.999A1.5 1.5 0 0014 6.5z"
      ></path>
    </svg>
  );
}
