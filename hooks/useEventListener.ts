import { useEffect } from "react";

interface IUseEventListener {
  target: Element | HTMLElement | Document | Window | null;
  type: string;
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
  ignore?: boolean;
}

export function useEventListener({
  target,
  type,
  listener,
  options,
  ignore,
}: IUseEventListener): void {
  useEffect(() => {
    if (!target || ignore) {
      return;
    }

    target.addEventListener(type, listener, options);

    return () => {
      target.removeEventListener(type, listener, options);
    };
  }, [target, type, listener, options, ignore]);
}
