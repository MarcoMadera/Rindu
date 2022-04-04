import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useState,
} from "react";

export interface Context {
  element: ReactElement | null;
  displayOnFixed: boolean;
  setDisplayOnFixed: Dispatch<SetStateAction<boolean>>;
  setElement: Dispatch<SetStateAction<ReactElement | null>>;
  headerColor: string;
  setHeaderColor: Dispatch<SetStateAction<string>>;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const HeaderContext = createContext<Context>(null!);
export default HeaderContext;

export const HeaderContextProvider: React.FC = ({ children }) => {
  const [displayOnFixed, setDisplayOnFixed] = useState<boolean>(false);
  const [element, setElement] = useState<ReactElement | null>(null);
  const [headerColor, setHeaderColor] = useState<string>("181818");
  return (
    <HeaderContext.Provider
      value={{
        displayOnFixed,
        setDisplayOnFixed,
        element,
        setElement,
        headerColor,
        setHeaderColor,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};
