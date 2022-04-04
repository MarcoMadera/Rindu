import HeaderContext from "context/HeaderContext";
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
} from "react";

export default function useHeader(
  options?: Partial<{ showOnFixed: boolean }>
): {
  element: ReactElement | null;
  setDisplayOnFixed: Dispatch<SetStateAction<boolean>>;
  headerColor: string;
  setHeaderColor: Dispatch<SetStateAction<string>>;
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
  } = useContext(HeaderContext);

  useEffect(() => {
    if (options?.showOnFixed) {
      setDisplayOnFixed(options.showOnFixed);
    }

    return () => {
      setDisplayOnFixed(false);
      setElement(null);
    };
  }, [options?.showOnFixed, setDisplayOnFixed, setElement]);

  return {
    element,
    setElement,
    setDisplayOnFixed,
    displayOnFixed,
    headerColor,
    setHeaderColor,
  };
}
