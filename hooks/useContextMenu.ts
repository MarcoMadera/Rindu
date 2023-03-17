import { useCallback, useContext } from "react";

import ContextMenuContext from "context/ContextMenuContext";
import type { UseContextMenu } from "types/contextMenu";

export function useContextMenu(): UseContextMenu {
  const context = useContext(ContextMenuContext);

  if (context === undefined) {
    throw new Error("useContextMenu must be used within a ContextMenuProvider");
  }

  const { contextMenuData, setContextMenuData } = context;

  const removeContextMenu: UseContextMenu["removeContextMenu"] =
    useCallback(() => {
      setContextMenuData(undefined);
    }, [setContextMenuData]);

  const addContextMenu: UseContextMenu["addContextMenu"] = useCallback(
    (data) => {
      setContextMenuData(data);
    },
    [setContextMenuData]
  );

  return {
    contextMenuData,
    addContextMenu,
    removeContextMenu,
  };
}
