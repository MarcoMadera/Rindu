import { DetailedHTMLProps, HTMLAttributes, ReactElement } from "react";

export default function Placeholder(
  props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
): ReactElement {
  return (
    <span {...props} className="placeholder">
      {props.children}
      <style jsx>{`
        span {
          display: inline-block;
          height: 18px;
          width: calc(100% - 1rem);
          border-radius: 0.25rem;
          background-color: #5e5d5db3;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0.8;
          }
        }
      `}</style>
    </span>
  );
}
