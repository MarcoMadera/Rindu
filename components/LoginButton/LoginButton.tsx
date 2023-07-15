import { ReactElement } from "react";

import { useTranslations } from "hooks";
import { getSpotifyLoginURL } from "utils";

export default function LoginButton(): ReactElement {
  const { translations } = useTranslations();

  return (
    <>
      <a href={getSpotifyLoginURL()}>{translations.loginButton}</a>
      <style jsx>{`
        a {
          border-radius: 500px;
          text-decoration: none;
          color: #fff;
          cursor: pointer;
          display: inline-block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.76px;
          line-height: 18px;
          padding: 12px 34px;
          text-align: center;
          text-transform: uppercase;
          transition: all 33ms cubic-bezier(0.3, 0, 0, 1);
          white-space: nowrap;
          background-color: #000000;
          border: 1px solid #ffffffb3;
          will-change: transform;
        }
        a:focus,
        a:hover {
          transform: scale(1.06);
          background-color: #000;
          border: 1px solid #fff;
        }
        a:active {
          transform: scale(1);
        }
        @media screen and (min-width: 0px) and (max-width: 780px) {
          a {
            padding: 8px 24px;
          }
        }
      `}</style>
    </>
  );
}
