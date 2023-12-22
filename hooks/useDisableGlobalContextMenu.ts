import { useEffect } from "react";

export function useDisableGlobalContextMenu(): void {
  useEffect(() => {
    function preventDefault(e: MouseEvent) {
      e.preventDefault();
    }

    window.addEventListener("contextmenu", preventDefault);

    return (): void => {
      window.removeEventListener("contextmenu", preventDefault);
    };
  }, []);
}
