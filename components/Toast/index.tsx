import { createPortal } from "react-dom";
import { ReactPortal, useEffect, useState } from "react";
import useToast from "hooks/useToast";
import ToastCard from "./ToastCard";

export default function Toast(): ReactPortal | null {
  const [targetNode, setTargetNode] = useState<Element | null>();

  const { toasts } = useToast();

  useEffect(() => {
    setTargetNode(document.querySelector("#toast"));
  }, []);

  if (targetNode === null) {
    throw new Error("Toast needs a target element with id: toast");
  }

  if (targetNode === undefined || !toasts.length) {
    return null;
  }

  return createPortal(
    <section>
      {toasts.map(({ id, variant, message, displayTime }) => (
        <ToastCard
          key={id}
          id={id}
          variant={variant}
          message={message}
          displayTime={displayTime}
        />
      ))}
      <style jsx>{`
        section {
          max-width: 400px;
          width: fit-content;
          position: fixed;
          left: 50%;
          bottom: 90px;
          transform: translate(-50%, -50%);
          margin: 0 auto;
          transition: 0.3s ease 0s;
        }
      `}</style>
    </section>,
    targetNode
  );
}
