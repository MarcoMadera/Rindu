import useAuth from "hooks/useAuth";
import { ReactElement } from "react";
import UserConfig from "./navbar/UserConfig";
import RouterButtons from "./RouterButtons";

export default function Header(): ReactElement {
  const { user } = useAuth();
  return (
    <header>
      <RouterButtons />
      {user ? (
        <UserConfig name={user?.name} img={user?.image} href={user?.href} />
      ) : (
        <div></div>
      )}
      <style jsx>{`
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 60px;
          width: 100%;
          height: 60px;
          background: #030303;
        }
      `}</style>
    </header>
  );
}
