import {
  PropsWithChildren,
  ReactElement,
  ReactPortal,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import { Heading } from "components";
import { IModalContext } from "context/ModalContext";
import { useFocusTrap, useTranslations } from "hooks";
import { AsType } from "types/heading";

interface IModalProps {
  title: string;
  setModalData: IModalContext["setModalData"];
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  modalRootId?: string;
  handleClose?: () => void;
}

function Modal({
  title,
  minWidth,
  maxWidth,
  maxHeight,
  minHeight,
  setModalData,
  children,
}: PropsWithChildren<
  Omit<IModalProps, "modalRootId" | "handleClose">
>): ReactElement {
  const { translations } = useTranslations();
  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(modalContainerRef);

  return (
    <div className="modal-container">
      <main
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="globalModalTitle"
        aria-live="polite"
        aria-describedby="globalModalDescription"
        tabIndex={-1}
        ref={modalContainerRef}
      >
        <header>
          <Heading number={3} as={AsType.H1} id="globalModalTitle">
            {title || "Modal"}
          </Heading>
          <button
            type="button"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setModalData(null);
            }}
            className="exitButton"
            title={translations.removeTracksModal.close}
          >
            <svg
              role="img"
              height="16"
              width="16"
              aria-hidden="true"
              aria-label="Cerrar"
              viewBox="0 0 16 16"
            >
              <path d="M1.47 1.47a.75.75 0 0 1 1.06 0L8 6.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L9.06 8l5.47 5.47a.75.75 0 1 1-1.06 1.06L8 9.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L6.94 8 1.47 2.53a.75.75 0 0 1 0-1.06z"></path>
            </svg>
          </button>
        </header>
        {children}
      </main>
      <style jsx>{`
        .modal {
          min-width: ${minWidth ?? "300px"};
          max-width: ${maxWidth ?? "664px"};
          min-height: ${minHeight ?? "300px"};
          max-height: ${maxHeight ?? "80vh"};
        }
      `}</style>
      <style jsx>{`
        .modal-container {
          position: fixed;
          z-index: 9999999999;
          top: 50%;
          left: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%);
          width: max-content;
        }
        .modal-container main:focus {
          outline: none;
        }
        :global(.overlay) {
          align-items: center;
          bottom: 0;
          display: flex;
          justify-content: center;
          left: 0;
          overflow: hidden;
          position: absolute;
          right: 0;
          top: 0;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 999999999999999999;
        }
        .modal {
          background-color: #181818;
          border-radius: 8px;
          box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3);
          color: #fff;
          z-index: 100;
          padding: 32px 32px 24px;
        }
        header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        button {
          display: flex;
          align-items: center;
          align-self: end;
          background-color: transparent;
          border-radius: 32px;
          border: 0;
          color: hsla(0, 0%, 100%, 0.7);
          grid-area: close-button;
          height: 32px;
          justify-content: center;
          margin-inline-end: -8px;
          margin-top: -8px;
          width: 32px;
        }
        svg {
          fill: currentColor;
        }
        button:focus {
          outline: none;
        }
        button:hover,
        button:focus {
          background-color: hsla(0, 0%, 100%, 0.1);
        }
        button:active {
          background-color: hsla(0, 0%, 100%, 0.2);
        }
      `}</style>
    </div>
  );
}

export default function ModalContainer({
  handleClose,
  ...props
}: PropsWithChildren<IModalProps>): ReactPortal | null {
  const [targetNode, setTargetNode] = useState<Element>();

  useEffect(() => {
    const targetSelector = props.modalRootId
      ? `#${props.modalRootId}`
      : "#globalModal";
    setTargetNode(document.querySelector(targetSelector) as Element);

    function cleanup() {
      setTargetNode(undefined);
      if (handleClose) handleClose();
    }

    return cleanup;
  }, [props.modalRootId, handleClose]);

  useLayoutEffect(() => {
    const elementToBlur = document.querySelector<HTMLElement>(".container");

    const handleClickOutside = (event: MouseEvent) => {
      if (targetNode && !targetNode.contains(event.target as Node)) {
        handleClose && handleClose();
        props.setModalData(null);
      }
    };

    if (elementToBlur) {
      elementToBlur.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (elementToBlur) {
        elementToBlur.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [props, targetNode, handleClose]);

  if (targetNode === undefined) {
    return null;
  }

  return createPortal(<Modal {...props} />, targetNode);
}
