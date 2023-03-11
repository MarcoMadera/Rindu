import { ReactElement, SVGProps } from "react";

export default function Chevron({
  rotation,
  ...props
}: { rotation?: string } & SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg height="24" role="img" width="24" viewBox="0 0 24 24" {...props}>
      <polygon points="15.54,21.151 5.095,12.229 15.54,3.309 16.19,4.069 6.635,12.229 16.19,20.39 "></polygon>
      <style jsx>{`
        svg {
          fill: currentColor;
          transform: rotate(${rotation ?? "90deg"});
        }
      `}</style>
    </svg>
  );
}
