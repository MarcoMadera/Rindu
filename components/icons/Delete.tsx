import { ReactElement, SVGProps } from "react";

export default function Delete(
  props: Readonly<SVGProps<SVGSVGElement>>
): ReactElement {
  return (
    <svg role="img" aria-hidden="true" viewBox="0 0 16 16" {...props}>
      <path d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06Z"></path>
    </svg>
  );
}
