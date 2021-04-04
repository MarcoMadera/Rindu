import { useRouter } from "next/router";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import {
  ACCESSTOKENCOOKIE,
  EXPIRETOKENCOOKIE,
  REFRESHTOKENCOOKIE,
} from "../../utils/constants";
import { eatCookie } from "../../utils/cookies";

interface UserConfigProps {
  name: string | undefined;
  img: string | undefined;
  href: string;
}

const UserConfig: React.FC<UserConfigProps> = ({ name, img, href }) => {
  const [openSettings, setOpenSettings] = useState(false);
  const router = useRouter();
  const { setUser, setIsLogin } = useAuth();
  function handleClick() {
    setOpenSettings(!openSettings);
  }
  return (
    <div>
      <button className="pill" onClick={handleClick}>
        <img src={img} alt={name} />
        <p>{name}</p>
      </button>
      <section>
        <a href={href} rel="noopener noreferrer" target="_blank">
          Perfil
        </a>
        <button
          onClick={() => {
            eatCookie(ACCESSTOKENCOOKIE);
            eatCookie(REFRESHTOKENCOOKIE);
            eatCookie(EXPIRETOKENCOOKIE);
            router.push("/");
            setUser(null);
            setIsLogin(false);
          }}
        >
          Cerrar sesión
        </button>
      </section>
      <style jsx>{`
        div {
          position: relative;
        }
        section {
          position: absolute;
          top: calc(100% + 4px);
          width: 100%;
          display: ${openSettings ? "block" : "none"};
          border-radius: 5px;
          background-color: #161616;
          box-shadow: 0px 2px 9px 0px rgb(0 0 0 / 5%);
          padding: 12px 0;
        }
        section * {
          background-color: transparent;
          width: 100%;
          padding: 4px 24px;
          border: none;
          display: inline-block;
          align-content: center;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          color: #fff;
          cursor: pointer;
          text-align: start;
          text-decoration: none;
        }
        section *:hover,
        section *:focus {
          outline: none;
          text-decoration: underline;
        }
        .pill {
          display: flex;
          align-items: center;
          background-color: #161616;
          padding: 6px 6px;
          border: none;
          cursor: pointer;
          border-radius: 30px;
          text-decoration: none;
          padding: 3px 4px;
          color: #e5e5e5;
        }
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }
        p {
          margin: 0;
          padding: 8px 17px 8px 4px;
          font-family: "Lato";
        }
      `}</style>
    </div>
  );
};

export default UserConfig;
