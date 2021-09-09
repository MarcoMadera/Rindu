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
        <svg height="16" width="16" fill="#fff" viewBox="0 0 16 16">
          <path d="M3 6l5 5.794L13 6z"></path>
        </svg>
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
          justify-content: center;
          align-items: center;
          background-color: #161616;
          border: none;
          cursor: pointer;
          border-radius: 30px;
          text-decoration: none;
          padding: 2px;
          gap: 8px;
          color: #e5e5e5;
        }
        img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
        }
        p {
          margin: 0;
          font-family: "Lato";
          line-height: 28px;
          max-width: 110px;
          overflow: hidden;
          pointer-events: none;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          font-family: sans-serif;
          font-weight: 700;
          letter-spacing: normal;
          line-height: 16px;
          text-transform: none;
        }
        svg {
          margin-right: 6px;
        }
      `}</style>
    </div>
  );
};

export default UserConfig;
