import { useMemo } from "react";

import { useCustomContext } from "./useCustomContext";
import UserContext, { IUserContext } from "../context/UserContext";

interface IUseAuth extends IUserContext {
  isPremium: boolean;
}

export function useAuth(): IUseAuth {
  const context = useCustomContext(UserContext);

  const isPremium = useMemo(
    () => context.user?.product === "premium",
    [context.user?.product]
  );

  return { ...context, isPremium };
}
