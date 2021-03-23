import LoginButton from "../components/login";
import Dashboard from "../components/dashboard";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  const { isLogin } = useAuth();

  return (
    <>
      <Navbar />
      {isLogin ? <Dashboard /> : <LoginButton />}
      <Footer />
    </>
  );
};

export default Home;
