import HeaderContext from "context/HeaderContext";
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
} from "react";

export default function useHeader(
  options?: Partial<{ showOnFixed: boolean; alwaysDisplayColor: boolean }>
): {
  element: ReactElement | null;
  setDisplayOnFixed: Dispatch<SetStateAction<boolean>>;
  headerColor: string;
  setHeaderColor: Dispatch<SetStateAction<string>>;
  alwaysDisplayColor: boolean;
  displayOnFixed: boolean;
  setElement: Dispatch<SetStateAction<ReactElement | null>>;
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
  } = useContext(HeaderContext);

  useEffect(() => {
    if (options?.showOnFixed) {
      setDisplayOnFixed(options.showOnFixed);
    }
    if (options?.alwaysDisplayColor) {
      setAlwaysDisplayColor(options.alwaysDisplayColor);
    }

    return () => {
      setDisplayOnFixed(false);
      setAlwaysDisplayColor(false);
      setElement(null);
    };
  }, [
    options?.alwaysDisplayColor,
    options?.showOnFixed,
    setAlwaysDisplayColor,
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
  };
}
