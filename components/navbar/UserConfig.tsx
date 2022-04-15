import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRE_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "../../utils/constants";
import { eatCookie } from "../../utils/cookies";
import Link from "next/link";
import { ExternalLink } from "components/icons/ExternalLink";

interface UserConfigProps {
  name: string | undefined;
  img: string | undefined;
}

const UserConfig: React.FC<UserConfigProps> = ({ name, img }) => {
  const [openSettings, setOpenSettings] = useState(false);
  const router = useRouter();
  const { user, setUser, setIsLogin } = useAuth();
  const isPremium = user?.product === "premium";

  useEffect(() => {
    if (openSettings) {
      document.body.addEventListener("click", () => {
        setOpenSettings(false);
      });
    } else {
      document.body.removeEventListener("click", () => {
        setOpenSettings(false);
      });
    }

    return () => {
      document.body.removeEventListener("click", () => {
        setOpenSettings(false);
      });
    };
  }, [openSettings]);

  return (
    <div className="container">
      <button
        className="pill"
        onClick={(e) => {
          setOpenSettings(!openSettings);
          e.stopPropagation();
        }}
      >
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="img" src={img} alt={name} />
        ) : (
          <div className="img"></div>
        )}
        <p>{name}</p>
        <svg height="16" width="16" fill="#fff" viewBox="0 0 16 16">
          <path d="M3 6l5 5.794L13 6z"></path>
        </svg>
      </button>
      <section role="menu" tabIndex={0}>
        <div role="presentation">
          <a
            role="menuitem"
            tabIndex={-1}
            className="option"
            href="https://www.spotify.com/account/overview"
            rel="noopener noreferrer"
            target="_blank"
          >
            Account
            <ExternalLink width={16} height={16} fill="#fff" />
          </a>
        </div>
        <div role="presentation">
          <Link href={`/user/${user?.id}`}>
            <a role="menuitem" tabIndex={-1} className="option">
              Profile
            </a>
          </Link>
        </div>
        {!isPremium ? (
          <div role="presentation">
            <a
              role="menuitem"
              tabIndex={-1}
              className="option"
              href="https://www.spotify.com/premium/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Upgrate to Premium
              <ExternalLink width={16} height={16} fill="#fff" />
            </a>
          </div>
        ) : null}
        <div role="presentation">
          <button
            role="menuitem"
            tabIndex={-1}
            className="option"
            onClick={() => {
              eatCookie(ACCESS_TOKEN_COOKIE);
              eatCookie(REFRESH_TOKEN_COOKIE);
              eatCookie(EXPIRE_TOKEN_COOKIE);
              router.push("/");
              setUser(null);
              setIsLogin(false);
            }}
          >
            Log out
          </button>
        </div>
      </section>
      <style jsx>{`
        div.container {
          position: relative;
          margin-left: 16px;
        }
        section {
          position: absolute;
          top: calc(100% + 4px);
          right: 0;
          display: ${openSettings ? "block" : "none"};
          border-radius: 5px;
          background-color: #282828;
          box-shadow: 0px 2px 9px 0px rgb(0 0 0 / 5%);
          padding: 3px;
          min-width: 100%;
        }
        .option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          border-radius: 2px;
          height: 40px;
        }
        .option :global(svg) {
          margin-left: 16px;
        }
        .option {
          background-color: transparent;
          width: max-content;
          min-width: 100%;
          border: none;
          display: flex;
          align-content: center;
          font-weight: 400;
          font-size: 14px;
          line-height: 16px;
          color: #ffffffe6;
          cursor: pointer;
          text-align: start;
          text-decoration: none;
          cursor: default;
          border-radius: 3px;
          align-items: center;
        }
        .option:hover,
        .option:focus {
          outline: none;
          background-color: #ffffff1a;
        }
        .pill {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: ${openSettings ? "#161616" : "#000000b3"};
          border: none;
          cursor: pointer;
          border-radius: 30px;
          text-decoration: none;
          padding: 2px;
          gap: 8px;
          color: #e5e5e5;
          min-height: 28px;
        }
        .pill:hover {
          background-color: #161616;
        }
        .img {
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
