import { ReactElement, SVGProps } from "react";

export default function LyricsPictureInPicture(
  props: SVGProps<SVGSVGElement>
): ReactElement {
  return (
    <svg role="img" height="20" width="20" viewBox="-2 0 20 16" {...props}>
      <g fill="currentColor" fillRule="evenodd">
        <g opacity="0.6">
          <path d="M1 3v9h14V3H1zm0-1h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"></path>
          <path d="M10 8h4v3h-4z"></path>
        </g>
        <g transform="translate(-2, -2) scale(0.8)" opacity="1">
          <path d="M13.426 2.574a2.831 2.831 0 00-4.797 1.55l3.247 3.247a2.831 2.831 0 001.55-4.797zM10.5 8.118l-2.619-2.62A63303.13 63303.13 0 004.74 9.075L2.065 12.12a1.287 1.287 0 001.816 1.816l3.06-2.688 3.56-3.129zM7.12 4.094a4.331 4.331 0 114.786 4.786l-3.974 3.493-3.06 2.689a2.787 2.787 0 01-3.933-3.933l2.676-3.045 3.505-3.99z"></path>
        </g>
      </g>
    </svg>
  );
}
