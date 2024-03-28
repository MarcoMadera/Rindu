import { RefObject, useEffect, useState } from "react";

export function useOnScreen(
  ref: RefObject<HTMLElement>,
  rootMargin?: string
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref, rootMargin]);

  return isIntersecting;
}
