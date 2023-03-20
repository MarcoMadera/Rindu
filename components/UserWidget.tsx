import { ReactElement, useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { ShortCuts } from "components";
import { ExternalLink } from "components/icons";
import { useAuth, useModal, useTranslations } from "hooks";
import {
  ACCESS_TOKEN_COOKIE,
  eatCookie,
  EXPIRE_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "utils";

interface UserConfigProps {
  name: string | undefined;
  img: string | undefined;
}

export default function UserWidget({
  name,
  img,
}: UserConfigProps): ReactElement {
  const [openSettings, setOpenSettings] = useState(false);
  const router = useRouter();
  const { user, setUser, setIsLogin } = useAuth();
  const { setModalData } = useModal();
  const isPremium = user?.product === "premium";
  const { translations } = useTranslations();

  useEffect(() => {
    function handleClick() {
      setOpenSettings(false);
    }
    if (openSettings) {
      document.body.addEventListener("click", handleClick);
    } else {
      document.body.removeEventListener("click", handleClick);
    }

    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, [openSettings]);

  return (
    <div className="container">
      <button
        type="button"
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
            {translations.account}
            <ExternalLink width={16} height={16} fill="#fff" />
          </a>
        </div>
        <div role="presentation">
          {user?.id ? (
            <Link
              href={`/user/${user.id}`}
              role="menuitem"
              tabIndex={-1}
              className="option"
            >
              {translations.profile}
            </Link>
          ) : null}
        </div>
        <div role="presentation">
          <a
            role="menuitem"
            tabIndex={-1}
            className="option"
            href="https://support.spotify.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            {translations.help}
            <ExternalLink width={16} height={16} fill="#fff" />
          </a>
        </div>
        <div role="presentation">
          <a
            role="menuitem"
            tabIndex={-1}
            className="option"
            href="https://www.spotify.com/download/"
            rel="noopener noreferrer"
            target="_blank"
          >
            {translations.download}
            <ExternalLink width={16} height={16} fill="#fff" />
          </a>
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
              {translations.upgradeToPremium}
              <ExternalLink width={16} height={16} fill="#fff" />
            </a>
          </div>
        ) : null}
        <div role="presentation">
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            className="option"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setModalData({
                title: translations.shortCutsTitle,
                modalElement: <ShortCuts />,
              });
              setOpenSettings(false);
            }}
          >
            {translations.shortCutsTitle}
          </button>
        </div>
        <div role="presentation" className="delimiter">
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            className="option"
            onClick={(e) => {
              e.stopPropagation();
              eatCookie(ACCESS_TOKEN_COOKIE);
              eatCookie(REFRESH_TOKEN_COOKIE);
              eatCookie(EXPIRE_TOKEN_COOKIE);
              router.push("/");
              setUser(null);
              setIsLogin(false);
            }}
          >
            {translations.logOut}
          </button>
        </div>
      </section>
      <style jsx>{`
        div.container {
          margin-left: 16px;
          position: relative;
        }
        section {
          background-color: #282828;
          border-radius: 4px;
          box-shadow: 0 16px 24px rgba(0, 0, 0, 0.3),
            0 6px 8px rgba(0, 0, 0, 0.2);
          display: ${openSettings ? "block" : "none"};
          max-height: calc(100vh - 24px);
          max-width: 350px;
          min-width: 196px;
          overflow-y: auto;
          padding: 4px;
          position: absolute;
          right: 0;
          top: calc(100% + 4px);
        }
        .container :global(.option svg) {
          margin-left: 16px;
        }
        .container :global(.option) {
          align-content: center;
          align-items: center;
          background-color: transparent;
          border-radius: 3px;
          border: none;
          color: #ffffffe6;
          cursor: default;
          display: flex;
          font-size: 14px;
          font-weight: 400;
          height: 40px;
          justify-content: space-between;
          line-height: 16px;
          min-width: 100%;
          padding: 8px 10px;
          text-align: start;
          text-decoration: none;
          width: max-content;
        }
        .container :global(.delimiter) {
          border-top: 1px solid hsla(0, 0%, 100%, 0.1);
        }
        .container :global(.option:hover),
        .container :global(.option:focus) {
          outline: none;
          background-color: #ffffff1a;
        }
        .pill {
          align-items: center;
          background-color: ${openSettings ? "#161616" : "#000000b3"};
          border-radius: 30px;
          border: none;
          color: #e5e5e5;
          cursor: pointer;
          display: flex;
          gap: 8px;
          justify-content: center;
          min-height: 28px;
          padding: 2px;
          text-decoration: none;
        }
        .pill:hover {
          background-color: #161616;
        }
        .img {
          border-radius: 50%;
          height: 28px;
          object-fit: cover;
          width: 28px;
        }
        p {
          font-family: "Lato";
          font-family: sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: normal;
          line-height: 16px;
          line-height: 28px;
          margin: 0;
          max-width: 110px;
          overflow: hidden;
          pointer-events: none;
          text-overflow: ellipsis;
          text-transform: none;
          white-space: nowrap;
        }
        svg {
          margin-right: 6px;
        }
        @media screen and (max-width: 500px) {
          p {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
