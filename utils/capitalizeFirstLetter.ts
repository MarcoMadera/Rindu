import { ReactNode } from "react";

export function capitalizeFirstLetter(string: string | ReactNode[]): string {
  if (typeof string === "string") {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return (
      string[0]?.toString().charAt(0).toUpperCase() ||
      "" + (string[0]?.toString().slice(1) || "")
    );
  }
}
