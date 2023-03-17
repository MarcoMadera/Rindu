import { useMemo, useState } from "react";

export interface IUseToggleHandlers {
  on: () => void;
  off: () => void;
  toggle: () => void;
  reset: () => void;
}

export function useToggle(initialValue = false): [boolean, IUseToggleHandlers] {
  const [value, setValue] = useState(initialValue);

  const handlers: IUseToggleHandlers = useMemo(
    () => ({
      on: () => setValue(true),
      off: () => setValue(false),
      toggle: () => setValue((value) => !value),
      reset: () => setValue(initialValue),
    }),
    [initialValue]
  );

  return [value, handlers];
}
