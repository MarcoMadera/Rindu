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

const ModalContext = createContext<ModalContextProviderProps | undefined>(
  undefined
);

export interface ModalContextProviderProps {
  modalData: IModalData | null;
  setModalData: Dispatch<
    SetStateAction<ModalContextProviderProps["modalData"]>
  >;
}

interface IModalData {
  title: string;
  modalElement: ReactElement;
  minWidth?: string;
  maxWidth?: string;
  maxHeight?: string;
  minHeight?: string;
}

export function ModalContextProvider({
  children,
}: PropsWithChildren): ReactElement {
  const [modalData, setModalData] = useState<IModalData | null>(null);

  const value = useMemo(
    () => ({
      modalData,
      setModalData,
    }),
    [modalData, setModalData]
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
        >
          {modalData.modalElement}
        </ModalContainer>
      )}
      {children}
    </ModalContext.Provider>
  );
}

export default ModalContext;
