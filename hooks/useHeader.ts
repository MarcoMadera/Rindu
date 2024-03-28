import { useEffect } from "react";

import { useCustomContext } from "./useCustomContext";
import HeaderContext, { IHeaderContext } from "context/HeaderContext";

export function useHeader(
  options?: Partial<{
    showOnFixed: boolean;
    alwaysDisplayColor: boolean;
    disableOpacityChange: boolean;
    disableBackground: boolean;
  }>
): Omit<
  IHeaderContext,
  | "setAlwaysDisplayColor"
  | "setDisableBackground"
  | "setDisplayOnFixed"
  | "setDisableOpacityChange"
> {
  const {
    setElement,
    setDisplayOnFixed,
    setAlwaysDisplayColor,
    setDisableOpacityChange,
    setDisableBackground,
    ...context
  } = useCustomContext(HeaderContext);

  useEffect(() => {
    if (options?.showOnFixed) {
      setDisplayOnFixed(options.showOnFixed);
    }
    if (options?.alwaysDisplayColor) {
      setAlwaysDisplayColor(options.alwaysDisplayColor);
    }
    if (options?.disableOpacityChange) {
      setDisableOpacityChange(options?.disableOpacityChange);
    }
    if (options?.disableBackground) {
      setDisableBackground(options?.disableBackground);
    }
    return () => {
      setDisplayOnFixed(false);
      setAlwaysDisplayColor(false);
      setDisableOpacityChange(false);
      setDisableBackground(false);
      setElement(null);
    };
  }, [
    options?.alwaysDisplayColor,
    options?.disableOpacityChange,
    options?.showOnFixed,
    options?.disableBackground,
    setAlwaysDisplayColor,
    setDisableOpacityChange,
    setDisplayOnFixed,
    setDisableBackground,
    setElement,
  ]);

  return {
    setElement,
    ...context,
  };
}
