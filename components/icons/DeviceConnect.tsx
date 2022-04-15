import { ReactElement, SVGProps } from "react";

export default function DeviceConnect({
  fill,
  ...props
}: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      role="img"
      height="16"
      width="16"
      aria-label="Connect to a device"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill={fill}
        d="M6 2.75C6 1.784 6.784 1 7.75 1h6.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0114.25 15h-6.5A1.75 1.75 0 016 13.25V2.75zm1.75-.25a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h6.5a.25.25 0 00.25-.25V2.75a.25.25 0 00-.25-.25h-6.5zm-6 0a.25.25 0 00-.25.25v6.5c0 .138.112.25.25.25H4V11H1.75A1.75 1.75 0 010 9.25v-6.5C0 1.784.784 1 1.75 1H4v1.5H1.75zM4 15H2v-1.5h2V15z"
      ></path>
      <path
        fill={fill}
        d="M13 10a2 2 0 11-4 0 2 2 0 014 0zm-1-5a1 1 0 11-2 0 1 1 0 012 0z"
      ></path>
    </svg>
  );
}
