import { RefObject, useEffect, useState } from "react";

export default function useOnScreen(
  ref: RefObject<HTMLElement>,
  rootMargin?: string
): boolean {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref, rootMargin]);

  return isIntersecting;
}
