import {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export interface Context {
  element: ReactElement | null;
  displayOnFixed: boolean;
  setDisplayOnFixed: Dispatch<SetStateAction<boolean>>;
  alwaysDisplayColor: boolean;
  setAlwaysDisplayColor: Dispatch<SetStateAction<boolean>>;
  setElement: Dispatch<SetStateAction<ReactElement | null>>;
  headerColor: string;
  setHeaderColor: Dispatch<SetStateAction<string>>;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const HeaderContext = createContext<Context>(null!);
export default HeaderContext;

export function HeaderContextProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [displayOnFixed, setDisplayOnFixed] = useState<boolean>(false);
  const [alwaysDisplayColor, setAlwaysDisplayColor] = useState<boolean>(false);
  const [element, setElement] = useState<ReactElement | null>(null);
  const [headerColor, setHeaderColor] = useState<string>("#7a7a7a");
  return (
    <HeaderContext.Provider
      value={{
        displayOnFixed,
        setDisplayOnFixed,
        element,
        setElement,
        headerColor,
        setHeaderColor,
        alwaysDisplayColor,
        setAlwaysDisplayColor,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}
