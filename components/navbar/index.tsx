import Logo from "components/Logo";
import useAuth from "../../hooks/useAuth";
import UserConfig from "./UserConfig";

const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <header>
      <Logo />
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
