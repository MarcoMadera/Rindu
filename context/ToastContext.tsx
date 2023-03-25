import {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
  useMemo,
  useState,
} from "react";

import dynamic from "next/dynamic";

import type { IToast } from "types/toast";

const ToastContext = createContext<IToastContext | undefined>(undefined);

export interface IToastContext {
  toasts: IToast[];
  setToasts: Dispatch<SetStateAction<IToastContext["toasts"]>>;
}

const Toast = dynamic(() => import("components/Toast"), {
  ssr: false,
});

interface IToastContextProviderProps {
  value?: IToastContext;
}

export function ToastContextProvider({
  children,
  value: propsValue,
}: PropsWithChildren<IToastContextProviderProps>): ReactElement {
  const [toasts, setToasts] = useState<IToast[]>([]);
  const value = useMemo(
    () => ({ toasts, setToasts, ...propsValue }),
    [toasts, setToasts, propsValue]
  );

  return (
    <ToastContext.Provider value={value}>
      <Toast />
      {children}
    </ToastContext.Provider>
  );
}

export default ToastContext;
