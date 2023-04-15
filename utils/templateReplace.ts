import { cloneElement, isValidElement, ReactNode } from "react";

export function templateReplace(
  template: string,
  replacements: ReactNode[] | string[]
): string | ReactNode[] {
  const pattern = /\{(\w+)\}/g;
  const result: ReactNode[] = [];

  let lastSubstrIndex = 0;
  let match: RegExpExecArray | null = null;
  let isReact = false;

  while ((match = pattern.exec(template))) {
    const [matchStr, key] = match;
    const index = match.index;
    const substring = template.substring(lastSubstrIndex, index);

    let el = replacements[key as unknown as number];

    if (!el && el !== "" && el !== 0) {
      el = matchStr;
    }

    if (isValidElement(el)) {
      isReact = true;
      el = cloneElement(el, { key });
    }

    result.push(substring, el);
    lastSubstrIndex = index + matchStr.length;
  }

  const tail = template.substring(lastSubstrIndex);
  result.push(tail);

  return isReact ? result : result.join("");
}
