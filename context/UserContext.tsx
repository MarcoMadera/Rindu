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

export interface IUserContext {
  isLogin: boolean;
  user: SpotifyApi.UserObjectPrivate | null;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<SpotifyApi.UserObjectPrivate | null>>;
  accessToken: string | undefined;
  setAccessToken: Dispatch<SetStateAction<string | undefined>>;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const UserContext = createContext<IUserContext>(null!);
export default UserContext;

interface IUserContextProviderProps {
  value?: IUserContext;
}

export function UserContextProvider({
  children,
  value: propsValue,
}: PropsWithChildren<IUserContextProviderProps>): ReactElement {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [user, setUser] = useState<SpotifyApi.UserObjectPrivate | null>(null);
  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    setIsLogin(!!user);
  }, [user]);

  useEffect(() => {
    if (router.query.code && isLogin) {
      router.replace("/dashboard", undefined, { shallow: true });
    }
  }, [router, isLogin]);

  const value = useMemo(
    () => ({
      isLogin,
      user,
      setIsLogin,
      setUser,
      accessToken,
      setAccessToken,
      ...propsValue,
    }),
    [
      isLogin,
      user,
      setIsLogin,
      setUser,
      accessToken,
      setAccessToken,
      propsValue,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
