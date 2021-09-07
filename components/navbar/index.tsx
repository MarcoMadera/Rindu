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
          color: #e5e5e5;
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin: 0 auto;
          max-width: 1400px;
          padding: 20px;
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
