import { ReactNode } from "react";

export function conjuction(
  value: ReactNode[] | string,
  locale: string,
  options: Intl.ListFormatOptions = { type: "unit" }
): ReactNode[] | string {
  const serializedValue: Array<string> = [];
  const reactNodes = new Map<string, ReactNode>();

  let index = 0;
  for (const item of value) {
    let serializedItem;
    if (typeof item === "object") {
      serializedItem = String(index);
      reactNodes.set(serializedItem, item);
    } else {
      serializedItem = String(item);
    }
    serializedValue.push(serializedItem);
    index++;
  }

  try {
    const listFormat = new Intl.ListFormat(locale, options);
    const formattedParts = listFormat.formatToParts(serializedValue);
    const result = formattedParts.map((part) =>
      part.type === "literal"
        ? part.value
        : reactNodes.get(part.value) ?? part.value
    );

    if (reactNodes.size > 0) {
      return result;
    } else {
      return result.join("");
    }
  } catch (error) {
    return String(value);
  }
}
