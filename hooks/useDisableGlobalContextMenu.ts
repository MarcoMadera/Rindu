import { useEffect } from "react";

export default function useDisableGlobalContextMenu(): void {
  useEffect(() => {
    window.addEventListener("contextmenu", (e) => e.preventDefault());

    return (): void => {
      window.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, []);
}
