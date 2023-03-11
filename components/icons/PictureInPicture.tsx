import { ReactElement, SVGProps } from "react";

export default function PictureInPicture(
  props: SVGProps<SVGSVGElement>
): ReactElement {
  return (
    <svg role="img" height="16" width="16" viewBox="0 0 16 16" {...props}>
      <g fill="currentColor" fillRule="evenodd">
        <path
          d="M1 3v9h14V3H1zm0-1h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
          fillRule="nonzero"
        ></path>
        <path d="M10 8h4v3h-4z"></path>
      </g>
    </svg>
  );
}
