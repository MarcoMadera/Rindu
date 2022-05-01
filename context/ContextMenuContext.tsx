import dynamic from "next/dynamic";
import { useState, createContext, ReactNode, ReactElement } from "react";
import { ContextMenuContextProviderProps } from "types/contextMenu";

const ContextMenuContext = createContext<
  ContextMenuContextProviderProps | undefined
>(undefined);

const ContextMenu = dynamic(() => import("components/ContextMenu"), {
  ssr: false,
});

export function ContextMenuContextProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [contextMenuData, setContextMenuData] =
    useState<ContextMenuContextProviderProps["contextMenuData"]>(undefined);

  return (
    <ContextMenuContext.Provider
      value={{
        contextMenuData,
        setContextMenuData,
      }}
    >
      <ContextMenu />
      {children}
    </ContextMenuContext.Provider>
  );
}

export default ContextMenuContext;
