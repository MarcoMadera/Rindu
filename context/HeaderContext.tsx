import {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface IHeaderContext {
  element: ReactElement | null;
  displayOnFixed: boolean;
  setDisplayOnFixed: Dispatch<SetStateAction<boolean>>;
  alwaysDisplayColor: boolean;
  disableBackground: boolean;
  setAlwaysDisplayColor: Dispatch<SetStateAction<boolean>>;
  setElement: Dispatch<SetStateAction<ReactElement | null>>;
  headerColor: string;
  setHeaderColor: Dispatch<SetStateAction<string>>;
  disableOpacityChange: boolean;
  setDisableOpacityChange: Dispatch<SetStateAction<boolean>>;
  setDisableBackground: Dispatch<SetStateAction<boolean>>;
}

const HeaderContext = createContext<IHeaderContext | undefined>(undefined);
export default HeaderContext;

interface IHeaderContextProviderProps {
  value?: IHeaderContext;
}

export function HeaderContextProvider({
  children,
  value: propsValue,
}: PropsWithChildren<IHeaderContextProviderProps>): ReactElement {
  const [displayOnFixed, setDisplayOnFixed] = useState<boolean>(false);
  const [alwaysDisplayColor, setAlwaysDisplayColor] = useState<boolean>(false);
  const [disableOpacityChange, setDisableOpacityChange] =
    useState<boolean>(false);
  const [element, setElement] = useState<ReactElement | null>(null);
  const [headerColor, setHeaderColor] = useState<string>("#7a7a7a");
  const [disableBackground, setDisableBackground] = useState<boolean>(false);

  useEffect(() => {
    if (headerColor) {
      document.body.style.setProperty("--header-color", headerColor);
    }

    return () => {
      document.body.style.removeProperty("--header-color");
    };
  }, [headerColor]);

  const value = useMemo(
    () => ({
      displayOnFixed,
      setDisplayOnFixed,
      element,
      setElement,
      headerColor,
      setHeaderColor,
      alwaysDisplayColor,
      setAlwaysDisplayColor,
      disableOpacityChange,
      setDisableOpacityChange,
      disableBackground,
      setDisableBackground,
      ...propsValue,
    }),
    [
      displayOnFixed,
      setDisplayOnFixed,
      element,
      setElement,
      headerColor,
      setHeaderColor,
      alwaysDisplayColor,
      setAlwaysDisplayColor,
      disableOpacityChange,
      setDisableOpacityChange,
      disableBackground,
      setDisableBackground,
      propsValue,
    ]
  );

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
}
