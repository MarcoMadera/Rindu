import HeaderContext from "context/HeaderContext";
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
} from "react";

export default function useHeader(
  options?: Partial<{
    showOnFixed: boolean;
    alwaysDisplayColor: boolean;
    disableOpacityChange: boolean;
  }>
): {
  element: ReactElement | null;
  setDisplayOnFixed: Dispatch<SetStateAction<boolean>>;
  headerColor: string;
  setHeaderColor: Dispatch<SetStateAction<string>>;
  alwaysDisplayColor: boolean;
  displayOnFixed: boolean;
  setElement: Dispatch<SetStateAction<ReactElement | null>>;
  headerOpacity: number;
  setHeaderOpacity: Dispatch<SetStateAction<number>>;
  disableOpacityChange: boolean;
  setDisableOpacityChange: Dispatch<SetStateAction<boolean>>;
} {
  const {
    element,
    setElement,
    setDisplayOnFixed,
    displayOnFixed,
    headerColor,
    setHeaderColor,
    setAlwaysDisplayColor,
    alwaysDisplayColor,
    headerOpacity,
    setHeaderOpacity,
    disableOpacityChange,
    setDisableOpacityChange,
  } = useContext(HeaderContext);

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
    return () => {
      setDisplayOnFixed(false);
      setAlwaysDisplayColor(false);
      setDisableOpacityChange(false);
      setElement(null);
    };
  }, [
    options?.alwaysDisplayColor,
    options?.disableOpacityChange,
    options?.showOnFixed,
    setAlwaysDisplayColor,
    setDisableOpacityChange,
    setDisplayOnFixed,
    setElement,
  ]);

  return {
    element,
    setElement,
    setDisplayOnFixed,
    displayOnFixed,
    headerColor,
    setHeaderColor,
    alwaysDisplayColor,
    headerOpacity,
    setHeaderOpacity,
    disableOpacityChange,
    setDisableOpacityChange,
  };
}
