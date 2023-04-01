import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useMemo,
  useState,
} from "react";

import dynamic from "next/dynamic";

import { IModalContext } from "./ModalContext";
import { ModalContainer } from "components";
import { IContextMenuContext } from "types/contextMenu";

const ContextMenuContext = createContext<IContextMenuContext | undefined>(
  undefined
);

const ContextMenu = dynamic(() => import("components/ContextMenu"), {
  ssr: false,
});

interface IContextMenuContextProviderProps {
  value?: IContextMenuContext;
}

export function ContextMenuContextProvider({
  children,
  value: propsValue,
}: PropsWithChildren<IContextMenuContextProviderProps>): ReactElement {
  const [contextMenuData, setContextMenuData] =
    useState<IContextMenuContext["contextMenuData"]>(undefined);
  const [modalData, setModalData] = useState<IModalContext["modalData"] | null>(
    null
  );

  const value = useMemo(
    () => ({
      contextMenuData,
      setContextMenuData,
      modalData,
      setModalData,
      ...propsValue,
    }),
    [contextMenuData, setContextMenuData, modalData, setModalData, propsValue]
  );

  return (
    <ContextMenuContext.Provider value={value}>
      <ContextMenu />
      {modalData && (
        <ModalContainer
          title={modalData.title}
          setModalData={setModalData}
          maxHeight={modalData.maxHeight}
          maxWidth={modalData.maxWidth}
          minHeight={modalData.minHeight}
          minWidth={modalData.minWidth}
          modalRootId={modalData.modalRootId}
        >
          {modalData.modalElement}
        </ModalContainer>
      )}
      {children}
    </ContextMenuContext.Provider>
  );
}

export default ContextMenuContext;
