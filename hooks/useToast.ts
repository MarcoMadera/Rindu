import { useCallback, useContext, useId } from "react";
import ToastContext from "context/ToastContext";
import type { UseToast, IToast } from "types/toast";
import { uniqueId } from "lodash";

export default function useToast(): UseToast {
  const context = useContext(ToastContext);
  const id = useId();

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const { toasts, setToasts } = context;

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
        id: uniqueId(id),
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
