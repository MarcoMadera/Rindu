import { Range } from "types/customTypes";

export enum AsType {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
  P = "p",
  SPAN = "span",
}

export interface HeadingStyles {
  color?: Color;
  fontSize?: string;
  margin?: string;
  textAlign?: string;
  multiline?: number;
}

export interface HeadingProps extends HeadingStyles {
  number: Range<1, 7>;
  as?: AsType | Heading;
}
export interface SubHeadingProps {
  number: Range<1, 3>;
  as: AsType;
}

export type Heading = `h${HeadingProps["number"]}`;

export enum Color {
  Primary = "#fff",
  Secondary = "#e5e5e5",
}
export interface TextOptions {
  bold?: boolean;
  opacity?: number;
  color?: Color;
}

export interface TextProps extends TextOptions {
  as?: AsType;
}
