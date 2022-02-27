import LoginButton from "components/forLoginPage/LoginButton";
import Logo from "components/Logo";
import { useRouter } from "next/router";
import useAuth from "../../hooks/useAuth";
import UserConfig from "./UserConfig";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const isLoginPage = router.asPath === "/";

  if (isLoginPage) {
    return (
      <header>
        <div>
          <Logo color="#000" />
          <LoginButton />
        </div>
        <style jsx>{`
          header {
            height: 64px;
            background-color: #ffffff;
            padding: 0 20px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
            margin: 0 auto;
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0;
            z-index: 9129192;
          }
          div {
            max-width: 1568px;
            width: 100%;
            padding-left: 64px;
            padding-right: 64px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 auto;
          }
        `}</style>
      </header>
    );
  }

  return (
    <header>
      <Logo color="#fff" />
      {user ? <UserConfig name={user?.name} img={user?.image} /> : <div></div>}
      <style jsx>{`
        header {
          color: #e5e5e5;
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin: 0 auto;
          max-width: 1400px;
          padding: 20px;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
