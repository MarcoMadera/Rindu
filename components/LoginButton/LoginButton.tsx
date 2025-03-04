import { ReactElement } from "react";

import { useToast, useTranslations } from "hooks";
import { UseToast } from "types/toast";
import { ITranslations } from "types/translations";
import { env, getSpotifyLoginURL, isServer } from "utils";

export const handleLogin = async (
  translations: ITranslations,
  addToast: UseToast["addToast"]
): Promise<void> => {
  if (isServer()) return;
  try {
    const url = await getSpotifyLoginURL();
    window.location.href = url;
  } catch (error) {
    console.error("Error: handleLogin", error);
    addToast({
      variant: "error",
      message: translations.pages.home.loginButtonError,
    });
  }
};

export default function LoginButton(): ReactElement {
  const { translations } = useTranslations();
  const { addToast } = useToast();

  const handleClick = () => {
    handleLogin(translations, addToast);
  };

  return (
    <>
      <button onClick={handleClick}>
        {translations.pages.home.loginButton}
      </button>
      <style jsx>{`
        button {
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
        button:focus,
        button:hover {
          transform: scale(1.06);
          background-color: #000;
          border: 1px solid #fff;
        }
        button:active {
          transform: scale(1);
        }
        @media screen and (min-width: 0px) and (max-width: 780px) {
          button {
            padding: 8px 24px;
          }
        }
      `}</style>
    </>
  );
}
