import { useContext } from "react";

import ModalContext, { ModalContextProviderProps } from "context/ModalContext";

export function useModal(): ModalContextProviderProps {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within a ModalContextProvider");
  }
  return context;
}
