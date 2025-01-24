import { RefObject, useEffect, useRef, useState } from "react";

interface UserNearScreen {
  distance: string;
  externalRef?: RefObject<unknown>;
  once?: boolean;
  observe: boolean;
}

export function useNearScreen({
  distance = "100px",
  externalRef,
  once = true,
  observe,
}: UserNearScreen): {
  isNearScreen: boolean;
  fromRef: RefObject<null>;
} {
  const [isNearScreen, setIsNearScreen] = useState(false);
  const fromRef = useRef(null);

  useEffect(() => {
    const element = externalRef ? externalRef.current : fromRef.current;

    function onChange(
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) {
      const element = entries[0];

      if (element.isIntersecting) {
        setIsNearScreen(true);
        if (once) {
          observer.disconnect();
        }
      } else if (!once) {
        setIsNearScreen(false);
      }
    }

    const observer = observe
      ? new IntersectionObserver(onChange, {
          rootMargin: distance,
        })
      : undefined;

    if (element && observe) observer?.observe(element as HTMLElement);

    return () => observer && observer.disconnect();
  });

  return { isNearScreen, fromRef };
}
