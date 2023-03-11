import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useState,
} from "react";

import dynamic from "next/dynamic";

import { ContextMenuContextProviderProps } from "types/contextMenu";

const ContextMenuContext = createContext<
  ContextMenuContextProviderProps | undefined
>(undefined);

const ContextMenu = dynamic(() => import("components/ContextMenu"), {
  ssr: false,
});

export function ContextMenuContextProvider({
  children,
}: PropsWithChildren): ReactElement {
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
