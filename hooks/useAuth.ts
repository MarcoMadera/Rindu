import { useContext, useMemo } from "react";

import UserContext, { IUserContext } from "../context/UserContext";

interface IUseAuth extends IUserContext {
  isPremium: boolean;
}

export function useAuth(): IUseAuth {
  const context = useContext(UserContext);

  const isPremium = useMemo(
    () => context.user?.product === "premium",
    [context.user?.product]
  );

  return { ...context, isPremium };
}
