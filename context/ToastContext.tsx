import Toast from "components/Toast";
import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  ReactElement,
  PropsWithChildren,
} from "react";
import type { IToast } from "types/toast";

const ToastContext = createContext<ToastContextProviderProps | undefined>(
  undefined
);

interface ToastContextProviderProps {
  toasts: IToast[];
  setToasts: Dispatch<SetStateAction<ToastContextProviderProps["toasts"]>>;
}

export function ToastContextProvider({
  children,
}: PropsWithChildren): ReactElement {
  const [toasts, setToasts] = useState<IToast[]>([]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        setToasts,
      }}
    >
      <Toast />
      {children}
    </ToastContext.Provider>
  );
}

export default ToastContext;
