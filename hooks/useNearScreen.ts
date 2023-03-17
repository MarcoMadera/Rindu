import { MutableRefObject, useEffect, useRef, useState } from "react";

interface UserNearScreen {
  distance: string;
  externalRef?: MutableRefObject<unknown>;
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
  fromRef: MutableRefObject<undefined>;
} {
  const [isNearScreen, setShow] = useState(false);
  const fromRef = useRef();

  useEffect(() => {
    const element = externalRef ? externalRef.current : fromRef.current;

    function onChange(
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) {
      const element = entries[0];

      if (element.isIntersecting) {
        setShow(true);
        once && observer.disconnect();
      } else {
        !once && setShow(false);
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
