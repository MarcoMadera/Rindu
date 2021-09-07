import { useRouter } from "next/router";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { SpotifyUserResponse } from "types/spotify";

export interface Context {
  isLogin: boolean;
  user: SpotifyUserResponse | null;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<SpotifyUserResponse | null>>;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const UserContext = createContext<Context>(null!);
export default UserContext;

export const UserContextProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [user, setUser] = useState<SpotifyUserResponse | null>(null);

  useEffect(() => {
    if (router.query.code && isLogin) {
      router.replace("/dashboard", undefined, { shallow: true });
    }
  }, [router, isLogin]);

  return (
    <UserContext.Provider
      value={{
        isLogin,
        user,
        setIsLogin,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
