import { ReactPortal, useEffect, useState } from "react";

import { createPortal } from "react-dom";

import { ToastCard } from "components";
import { useToast } from "hooks";

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
        }
        :global(#toast) {
          position: relative;
          z-index: 993332323233232399;
        }
      `}</style>
    </section>,
    targetNode
  );
}
