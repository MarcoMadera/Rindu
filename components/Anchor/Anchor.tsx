import { AnchorHTMLAttributes, DetailedHTMLProps, ReactElement } from "react";

export enum Emphasis {
  Bold = "700",
  Normal = "400",
}

export enum Color {
  Primary = "#fff",
  Secondary = "#b3b3b3",
}

export enum TextDecoration {
  Underline = "underline",
  None = "none",
}

interface IAnchor {
  emphasis?: Emphasis;
  color?: Color;
  hoverDecoration?: TextDecoration;
}

export default function Anchor({
  emphasis = Emphasis.Normal,
  color = Color.Primary,
  hoverDecoration = TextDecoration.Underline,
  ...props
}: DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  IAnchor): ReactElement | null {
  return (
    <a {...props}>
      {props.children}
      <style jsx>{`
        a {
          text-decoration: none;
          touch-action: manipulation;
        }
        a:hover,
        a:focus {
          color: #fff;
        }
        a:focus {
          outline: none;
        }
      `}</style>
      <style jsx>{`
        a {
          font-weight: ${emphasis};
          color: ${color};
        }
        a:focus,
        a:hover {
          text-decoration: ${hoverDecoration};
          color: #fff;
        }
      `}</style>
    </a>
  );
}
