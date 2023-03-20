import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  PropsWithChildren,
  ReactElement,
} from "react";

export default function Buttton({
  children,
  ...props
}: PropsWithChildren<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>): ReactElement {
  return (
    <button {...props}>
      {children}
      <style jsx>{`
        button {
          border-radius: 500px;
          text-decoration: none;
          color: #000;
          cursor: pointer;
          display: inline-block;
          font-family: Lato, sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.3px;
          line-height: 18px;
          padding: 4px 16px;
          text-align: center;
          transition: all 33ms cubic-bezier(0.3, 0, 0, 1);
          white-space: nowrap;
          background-color: #1ed760;
          border: 1px solid #1db954b3;
          will-change: transform;
          word-spacing: 3px;
          min-block-size: 32px;
        }
        button:focus,
        button:hover {
          background-color: #1fdf64;
          transform: scale(1.04);
        }
        button:active {
          transform: scale(1);
        }
      `}</style>
    </button>
  );
}
