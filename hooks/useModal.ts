import { useContext } from "react";

import ModalContext, { IModalContext } from "context/ModalContext";

export function useModal(): IModalContext {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within a ModalContextProvider");
  }
  return context;
}
