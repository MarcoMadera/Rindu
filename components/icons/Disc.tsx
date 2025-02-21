import { ReactElement, SVGProps } from "react";

export default function Disc(
  props: Readonly<SVGProps<SVGSVGElement>>
): ReactElement {
  return (
    <svg role="img" aria-hidden="true" viewBox="0 0 16 16" {...props}>
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
      <path d="M8 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM5 8a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"></path>
    </svg>
  );
}
