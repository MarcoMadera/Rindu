import {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
  useMemo,
  useState,
} from "react";

import { ModalContainer } from "components";

const ModalContext = createContext<IModalContext | undefined>(undefined);

export interface IModalContext {
  modalData: IModalData | null;
  setModalData: Dispatch<SetStateAction<IModalContext["modalData"]>>;
}

interface IModalData {
  title: string;
  modalElement: ReactElement;
  minWidth?: string;
  maxWidth?: string;
  maxHeight?: string;
  minHeight?: string;
  modalRootId?: string;
  handleClose?: () => void;
}

interface IModalContextProviderProps {
  value?: IModalContext;
}

export function ModalContextProvider({
  children,
  value: propsValue,
}: PropsWithChildren<IModalContextProviderProps>): ReactElement {
  const [modalData, setModalData] = useState<IModalData | null>(null);

  const value = useMemo(
    () => ({
      modalData,
      setModalData,
      ...propsValue,
    }),
    [modalData, setModalData, propsValue]
  );

  return (
    <ModalContext.Provider value={value}>
      {modalData && (
        <ModalContainer
          title={modalData.title}
          setModalData={setModalData}
          maxHeight={modalData.maxHeight}
          maxWidth={modalData.maxWidth}
          minHeight={modalData.minHeight}
          minWidth={modalData.minWidth}
          modalRootId={modalData.modalRootId}
          handleClose={modalData.handleClose}
        >
          {modalData.modalElement}
        </ModalContainer>
      )}
      {children}
    </ModalContext.Provider>
  );
}

export default ModalContext;
