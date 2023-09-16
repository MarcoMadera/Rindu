import { PropsWithChildren, ReactPortal, useEffect, useState } from "react";

import { createPortal } from "react-dom";

import { TargetElementError } from "utils";

export default function PortalTarget({
  children,
  targetId,
}: PropsWithChildren<{ targetId: string }>): ReactPortal | null {
  const [target, setTarget] = useState<Element | null>();

  useEffect(() => {
    const targetElement = document.querySelector(`#${targetId}`);
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
