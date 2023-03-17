import { useEffect } from "react";

export function useDisableGlobalContextMenu(): void {
  useEffect(() => {
    window.addEventListener("contextmenu", (e) => e.preventDefault());

    return (): void => {
      window.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, []);
}
