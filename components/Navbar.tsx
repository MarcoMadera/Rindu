import useAuth from "../hooks/useAuth";
import UserConfig from "./dashboard/UserConfig";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  return (
    <header>
      <p translate="no">Rindu</p>
      {user ? (
        <UserConfig name={user?.name} img={user?.image} href={user?.href} />
      ) : (
        <div></div>
      )}
      <style jsx>{`
        header {
          height: 120px;
          width: 100vw;
          color: #e5e5e5;
          display: flex;
          padding: 0 100px;
          align-items: center;
          justify-content: space-between;
        }
        p {
          font-size: 36px;
          font-family: "Lato";
          width: 148px;
          text-align: center;
          color: #e5e5e5;
          margin: 0;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
