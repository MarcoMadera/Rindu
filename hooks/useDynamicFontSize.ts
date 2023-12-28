import { useLayoutEffect } from "react";

import { useOnSmallScreen } from "./useOnSmallScreen";

interface UseDynamicFontSizeProps {
  element: HTMLHeadingElement | null;
  maxFontSize: number;
  minFontSize: number;
  maxHeight: number;
  lineNum?: number;
}

function measureText(
  pText: string,
  pFontSize: number,
  width: number,
  maxHeight: number,
  lineNum: number
) {
  let lDiv: HTMLDivElement | null = document.createElement("div");

  document.body.appendChild(lDiv);
  lDiv.style.fontSize = `${pFontSize}px`;
  lDiv.style.position = "absolute";
  lDiv.style.left = "-1000";
  lDiv.style.top = "-1000";
  lDiv.style.maxWidth = `${width}px`;
  lDiv.style.maxHeight = `${maxHeight}px`;
  lDiv.style.webkitLineClamp = `${lineNum}`;
  lDiv.style.textOverflow = "ellipsis";
  lDiv.style.overflow = "hidden";
  lDiv.style.webkitBoxOrient = "vertical";
  lDiv.style.display = "-webkit-box";
  lDiv.style.lineHeight = "1";
  lDiv.textContent = pText;
  const lResult = {
    width: lDiv.scrollWidth,
    height: lDiv.scrollHeight,
  };

  document.body.removeChild(lDiv);
  lDiv = null;

  return lResult;
}

export function fitText(
  el: HTMLHeadingElement,
  maxFontSize: number,
  minFontSize: number,
  maxHeight: number,
  lineNum: number
): void {
  const text = el.textContent;
  if (!text) return;
  const computedStyles = getComputedStyle(el);
  let fsize = parseInt(computedStyles.fontSize);
  fsize = Math.max(fsize, minFontSize);
  const { width } = el.getBoundingClientRect();
  const measured = measureText(text, fsize, width, maxHeight, lineNum);
  const letsBeTrue = true;
  if (measured.width > width || measured.height > maxHeight) {
    while (letsBeTrue) {
      fsize = parseInt(computedStyles.fontSize);
      const m = measureText(text, fsize, width, maxHeight, lineNum);
      if ((m.width > width && fsize > minFontSize) || m.height > maxHeight) {
        el.style.fontSize = `${--fsize}px`;
      } else {
        break;
      }
    }
  } else {
    while (letsBeTrue) {
      fsize = parseInt(computedStyles.fontSize);
      const m = measureText(text, fsize, width, maxHeight, lineNum);
      if (m.width < width - 4 && fsize < maxFontSize) {
        el.style.fontSize = `${++fsize}px`;
      } else {
        break;
      }
    }
  }
}

export function useDynamicFontSize({
  element,
  maxFontSize,
  minFontSize,
  maxHeight,
  lineNum = 1,
}: UseDynamicFontSizeProps): void {
  const isSmallScreen = useOnSmallScreen();
  useLayoutEffect(() => {
    if (isSmallScreen) {
      if (!element) return;
      element.style.fontSize = `${minFontSize}px`;
      return;
    }
    const handleResize = () => {
      if (element) {
        fitText(element, maxFontSize, minFontSize, maxHeight, lineNum);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (!element) return;
      element.style.fontSize = "";
    };
  }, [
    element,
    maxFontSize,
    element?.textContent,
    minFontSize,
    maxHeight,
    lineNum,
    isSmallScreen,
  ]);
}
