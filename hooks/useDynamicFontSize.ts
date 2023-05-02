import { useLayoutEffect } from "react";

interface UseDynamicFontSizeProps {
  ref: React.RefObject<HTMLHeadingElement>;
  maxFontSize: number;
  minFontSize: number;
}

function measureText(pText: string, pFontSize: number) {
  let lDiv: HTMLDivElement | null = document.createElement("div");

  document.body.appendChild(lDiv);
  lDiv.style.fontSize = `${pFontSize}px`;
  lDiv.style.position = "absolute";
  lDiv.style.left = "-1000";
  lDiv.style.top = "-1000";

  lDiv.textContent = pText;

  const lResult = {
    width: lDiv.clientWidth,
    height: lDiv.clientHeight,
  };

  document.body.removeChild(lDiv);
  lDiv = null;

  return lResult;
}

export function fitText(
  el: HTMLHeadingElement,
  maxFontSize: number,
  minFontSize: number
): void {
  const text = el.textContent;
  if (!text) return;
  const computedStyles = getComputedStyle(el);
  let fsize = parseInt(computedStyles.fontSize);
  fsize = Math.max(fsize, minFontSize);
  const measured = measureText(text, fsize);
  const { width } = el.getBoundingClientRect();
  const letsBeTrue = true;
  if (measured.width > width) {
    while (letsBeTrue) {
      fsize = parseInt(computedStyles.fontSize);
      const m = measureText(text, fsize);
      if (m.width > width && fsize > minFontSize) {
        el.style.fontSize = `${--fsize}px`;
      } else {
        break;
      }
    }
  } else {
    while (letsBeTrue) {
      fsize = parseInt(computedStyles.fontSize);
      const m = measureText(text, fsize);
      if (m.width < width - 4 && fsize < maxFontSize) {
        el.style.fontSize = `${++fsize}px`;
      } else {
        break;
      }
    }
  }
}

export function useDynamicFontSize({
  ref,
  maxFontSize,
  minFontSize,
}: UseDynamicFontSizeProps): void {
  useLayoutEffect(() => {
    const element = ref.current;
    const handleResize = () => {
      if (element) {
        fitText(element, maxFontSize, minFontSize);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (!element) return;
      element.style.fontSize = "";
    };
  }, [ref, maxFontSize, ref.current?.textContent, minFontSize]);
}
