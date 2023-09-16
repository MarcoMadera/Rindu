import { useCallback, useId } from "react";

import ToastContext from "context/ToastContext";
import { useCustomContext } from "hooks";
import type { IToast, UseToast } from "types/toast";

export function useToast(): UseToast {
  const { toasts, setToasts } = useCustomContext(ToastContext);
  const id = useId();

  const removeToast: UseToast["removeToast"] = useCallback(
    (toastId) => {
      const timeOut = toasts.find((toast) => toast.id === toastId)?.timeOut;

      if (timeOut) {
        clearTimeout(timeOut);
      }

      setToasts((allToast) => {
        return allToast.filter((toast) => toast.id !== toastId);
      });
    },
    [setToasts, toasts]
  );

  const addToast: UseToast["addToast"] = useCallback(
    (toast) => {
      const displayTime = toast.displayTime ?? 10000;

      const newToast: IToast = {
        ...toast,
        id,
        displayTime,
        timeOut: setTimeout(() => {
          removeToast(newToast.id);
        }, displayTime),
      };

      setToasts([newToast]);
    },
    [id, setToasts, removeToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
  };
}
