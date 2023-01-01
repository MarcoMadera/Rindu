import { ReactElement, SVGProps } from "react";

export default function FullScreenExit(
  props: SVGProps<SVGSVGElement>
): ReactElement {
  return (
    <svg
      role="img"
      height="16"
      width="16"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fill="currentColor"
        d="M21.707 2.293a1 1 0 010 1.414L17.414 8h1.829a1 1 0 010 2H14V4.757a1 1 0 112 0v1.829l4.293-4.293a1 1 0 011.414 0zM2.293 21.707a1 1 0 010-1.414L6.586 16H4.757a1 1 0 010-2H10v5.243a1 1 0 01-2 0v-1.829l-4.293 4.293a1 1 0 01-1.414 0z"
      ></path>
    </svg>
  );
}
