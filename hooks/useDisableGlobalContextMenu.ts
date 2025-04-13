import { useEffect } from "react";

import { isServer } from "utils";

export function useDisableGlobalContextMenu(
  w: (Window & typeof globalThis) | undefined = isServer() ? undefined : window
): void {
  useEffect(() => {
    function preventDefault(e: MouseEvent) {
      e.preventDefault();
    }

    w?.addEventListener("contextmenu", preventDefault);

    return (): void => {
      w?.removeEventListener("contextmenu", preventDefault);
    };
  }, [w]);
}
