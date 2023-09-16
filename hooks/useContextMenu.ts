import { useCallback } from "react";

import ContextMenuContext from "context/ContextMenuContext";
import { useCustomContext } from "hooks";
import type { UseContextMenu } from "types/contextMenu";

export function useContextMenu(): UseContextMenu {
  const { contextMenuData, setContextMenuData, setModalData, modalData } =
    useCustomContext(ContextMenuContext);

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
    setModalData,
    modalData,
  };
}
