export enum LineType {
  FIRST = "first",
  CURRENT = "current",
  PREVIOUS = "previous",
  NEXT = "next",
}

export interface IAllLines {
  color: string;
  text: string;
  type: LineType;
}
