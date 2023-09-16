import { Context, useContext } from "react";

import { ContextError } from "utils";

export function useCustomContext<T>(
  Context: Context<T | undefined>
): NonNullable<T> {
  const context = useContext(Context);
  if (!context) {
    throw new ContextError(Context);
  }

  return context;
}
