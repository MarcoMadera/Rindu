import { ReactElement, useEffect, useState } from "react";

import { PortalTarget, ToastCard } from "components";
import { useToast } from "hooks/useToast";

export default function Toast(): ReactElement | null {
  const [targetNode, setTargetNode] = useState<Element | null>();

  const { toasts } = useToast();

  useEffect(() => {
    setTargetNode(document.querySelector("#toast"));
  }, []);

  if (targetNode === undefined || !toasts.length) {
    return null;
  }

  return (
    <PortalTarget targetId="toast">
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
          @media screen and (max-width: 500px) {
            section {
              max-width: calc(100% -2rem);
              width: max-content;
            }
          }
        `}</style>
      </section>
    </PortalTarget>
  );
}
