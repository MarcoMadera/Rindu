import { ReactNode } from "react";

export interface NewToast {
  variant: "info" | "error" | "success";
  message: string | ReactNode[];
  displayTime?: number;
}

export interface IToast extends NewToast {
  timeOut: NodeJS.Timeout;
  id: string;
  displayTime: number;
}

export interface UseToast {
  toasts: IToast[];
  addToast: (toast: NewToast) => void;
  removeToast: (toastId: IToast["id"]) => void;
}
