import {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/router";

import { CODE_VERIFIER_COOKIE, eatCookie } from "utils";

export interface IUserContext {
  isLogin: boolean;
  user: SpotifyApi.UserObjectPrivate | null;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<SpotifyApi.UserObjectPrivate | null>>;
}

const UserContext = createContext<IUserContext | undefined>(undefined);
export default UserContext;

interface IUserContextProviderProps {
  value?: Partial<IUserContext>;
}

export function UserContextProvider({
  children,
  value: propsValue,
}: PropsWithChildren<IUserContextProviderProps>): ReactElement {
  const router = useRouter();
  const [user, setUser] = useState<SpotifyApi.UserObjectPrivate | null>(
    propsValue?.user ?? null
  );
  const [isLogin, setIsLogin] = useState<boolean>(!!propsValue?.user?.uri);

  useEffect(() => {
    setIsLogin(!!user?.uri);
  }, [user]);

  useEffect(() => {
    const isNotFoundPage = router.pathname === "/404";
    const isErrorPage = router.pathname === "/500";

    if (isNotFoundPage || isErrorPage) return;
    if (router.query.code && isLogin) {
      router.replace("/dashboard", undefined, { shallow: true });
      eatCookie(CODE_VERIFIER_COOKIE);
    }
  }, [router, isLogin]);

  const value = useMemo(
    () => ({
      isLogin,
      user,
      setIsLogin,
      setUser,
      ...propsValue,
    }),
    [isLogin, user, setIsLogin, setUser, propsValue]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
