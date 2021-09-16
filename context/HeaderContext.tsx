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
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const HeaderContext = createContext<Context>(null!);
export default HeaderContext;

export const HeaderContextProvider: React.FC = ({ children }) => {
  const [displayOnFixed, setDisplayOnFixed] = useState<boolean>(false);
  const [element, setElement] = useState<ReactElement | null>(null);

  return (
    <HeaderContext.Provider
      value={{
        displayOnFixed,
        setDisplayOnFixed,
        element,
        setElement,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};
