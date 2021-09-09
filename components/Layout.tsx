import { useRouter } from "next/router";
import Footer from "./Footer";
import Navbar from "./navbar";
import SpotifyPlayer from "./SpotifyPlayer";
import SideBar from "./SideBar";
import Header from "./Header";

const Layout: React.FC = ({ children }) => {
  const router = useRouter();
  return (
    <>
      {router.asPath === "/" ? (
        <>
          <Navbar />
          {children}
        </>
      ) : (
        <SideBar>
          <div>
            <Header />
            {children}
            <style jsx>{`
              div {
                display: flex;
                flex-direction: column;
              }
            `}</style>
          </div>
        </SideBar>
      )}

      {router.asPath === "/" ? <Footer /> : <SpotifyPlayer />}
    </>
  );
};

export default Layout;
