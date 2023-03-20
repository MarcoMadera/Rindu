import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useState,
} from "react";

import dynamic from "next/dynamic";

import { ModalContextProviderProps } from "./ModalContext";
import { ModalContainer } from "components";
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
  const [modalData, setModalData] = useState<
    ModalContextProviderProps["modalData"] | null
  >(null);

  return (
    <ContextMenuContext.Provider
      value={{
        contextMenuData,
        setContextMenuData,
        modalData,
        setModalData,
      }}
    >
      <ContextMenu />
      {modalData && (
        <ModalContainer
          title={modalData.title}
          setModalData={setModalData}
          maxHeight={modalData.maxHeight}
          maxWidth={modalData.maxWidth}
          minHeight={modalData.minHeight}
          minWidth={modalData.minWidth}
        >
          {modalData.modalElement}
        </ModalContainer>
      )}
      {children}
    </ContextMenuContext.Provider>
  );
}

export default ContextMenuContext;
