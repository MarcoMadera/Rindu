import useAuth from "hooks/useAuth";
import { ReactElement, useEffect, useState } from "react";
import UserConfig from "./navbar/UserConfig";
import RouterButtons from "./RouterButtons";
import { useRouter } from "next/router";

export default function Header(): ReactElement {
  const { user } = useAuth();
  const [showFixed, setShowFixed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const main = document.getElementsByTagName("main")[0];
    function onScroll() {
      const newShowFixed = main.scrollTop > 200;
      if (showFixed !== newShowFixed) {
        setShowFixed(newShowFixed);
      }
    }
    router.events.on("routeChangeComplete", () => {
      setShowFixed(false);
    });

    main?.addEventListener("scroll", onScroll);

    return () => {
      router.events.off("routeChangeComplete", () => {
        setShowFixed(false);
      });
      main?.removeEventListener("scroll", onScroll);
    };
  }, [showFixed, router]);

  return (
    <header>
      <div className="background">
        <div className="noise"></div>
      </div>
      <RouterButtons />
      {user ? (
        <UserConfig name={user?.name} img={user?.image} href={user?.href} />
      ) : (
        <div className="userConfig"></div>
      )}
      <style jsx>{`
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px;
          width: 100%;
          height: 60px;
          z-index: 999999;
          position: relative;
        }
        div.noise {
          background-color: #00000099;
          height: 100%;
        }
        div.background {
          background-color: #eae5e5;
          opacity: ${showFixed ? 1 : 0};
          bottom: 0;
          left: 0;
          overflow: hidden;
          pointer-events: none;
          position: absolute;
          right: 0;
          top: 0;
          transition: background-color 0.25s;
          z-index: -1;
        }
      `}</style>
    </header>
  );
}
