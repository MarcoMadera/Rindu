import {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
  useState,
} from "react";

import dynamic from "next/dynamic";

import type { IToast } from "types/toast";

const ToastContext = createContext<ToastContextProviderProps | undefined>(
  undefined
);

export interface ToastContextProviderProps {
  toasts: IToast[];
  setToasts: Dispatch<SetStateAction<ToastContextProviderProps["toasts"]>>;
}

// dinamic import the Toast component
const Toast = dynamic(() => import("components/Toast"), {
  ssr: false,
});

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
