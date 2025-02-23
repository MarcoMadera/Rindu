import { PropsWithChildren, ReactPortal, useEffect, useState } from "react";

import { createPortal } from "react-dom";

import { TargetElementError } from "utils";

export default function PortalTarget({
  children,
  targetId,
}: PropsWithChildren<{
  targetId?: string | HTMLElement;
}>): ReactPortal | null {
  const [target, setTarget] = useState<Element | HTMLElement | null>();

  useEffect(() => {
    const targetElement =
      typeof targetId === "string"
        ? document.querySelector(`#${targetId}`)
        : targetId;
    setTarget(targetElement);
  }, [targetId]);

  if (target === undefined) {
    return null;
  }

  if (target === null) {
    throw new TargetElementError(targetId);
  }

  return createPortal(children, target);
}
