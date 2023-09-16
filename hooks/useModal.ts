import ModalContext, { IModalContext } from "context/ModalContext";
import { useCustomContext } from "hooks";

export function useModal(): IModalContext {
  return useCustomContext(ModalContext);
}
