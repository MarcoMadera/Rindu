import Link from "next/link";
import useAuth from "../../hooks/useAuth";
import UserConfig from "./UserConfig";

const Navbar: React.FC = () => {
  const { isLogin, user } = useAuth();
  return (
    <header>
      <Link href={isLogin ? "/dashboard" : "/"}>
        <a translate="no">Rindu</a>
      </Link>
      {user ? (
        <UserConfig name={user?.name} img={user?.image} href={user?.href} />
      ) : (
        <div></div>
      )}
      <style jsx>{`
        header {
          height: 80px;
          width: 100vw;
          color: #e5e5e5;
          display: flex;
          padding: 0 100px;
          align-items: center;
          justify-content: space-between;
        }
        a {
          font-size: 36px;
          font-family: "Lato";
          width: 148px;
          text-align: center;
          color: #e5e5e5;
          margin: 0;
          text-decoration: none;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
