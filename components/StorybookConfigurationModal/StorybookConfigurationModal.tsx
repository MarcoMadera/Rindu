import { ReactElement, useState } from "react";

import { FormToggle, Heading, SelectControl, TextControl } from "components";
import { useTranslations } from "hooks";
import { AsType } from "types/heading";
import { ACCESS_TOKEN_COOKIE, getLocale, Locale, makeCookie } from "utils";

export interface StorybookConfigurationModalProps {
  setProduct: (product: string) => void;
  setIsLogin: (isLogin: boolean) => void;
  setLanguage: (language: Locale) => void;
  product: string;
  isLogin: boolean;
  language: Locale;
}

export default function StorybookConfigurationModal({
  setProduct,
  setIsLogin,
  product,
  isLogin,
  language,
  setLanguage,
}: Readonly<StorybookConfigurationModalProps>): ReactElement {
  const [inputAccessToken, setInputAccessToken] = useState("");
  const [isLoggedInput, setIsLoggedInput] = useState(isLogin);
  const { translations } = useTranslations();
  return (
    <div className="preferences-container">
      <Heading number={4} as={AsType.H2}>
        Language
      </Heading>
      <div className="section">
        <div className="label-container">
          <label htmlFor="product">
            Select a language to use with the components
          </label>
        </div>
        <div className="select-container">
          <SelectControl
            options={[
              {
                label: translations.pages.preferences.spanish,
                value: Locale.ES,
              },
              {
                label: translations.pages.preferences.english,
                value: Locale.EN,
              },
            ]}
            id="language"
            defaultValue={language}
            onChange={(e) => {
              setLanguage(getLocale(e.target.value));
            }}
          />
        </div>
      </div>
      <Heading number={4} as={AsType.H2}>
        Product Selection
      </Heading>
      <div className="section">
        <div className="label-container">
          <label htmlFor="product">
            Select a product to use with the components
          </label>
        </div>
        <div className="select-container">
          <SelectControl
            options={[
              { label: "Premium", value: "premium" },
              { label: "Free", value: "free" },
            ]}
            id="product"
            defaultValue={product}
            onChange={(e) => {
              setProduct(e.target.value);
            }}
          />
        </div>
      </div>
      <Heading number={4} as={AsType.H2}>
        Access Token
      </Heading>
      <div className="section">
        <div className="label-container">
          <label htmlFor="accessToken">
            To obtain an access token with the required scopes, go to{" "}
            <a
              href="https://developer.spotify.com/documentation/web-api/concepts/access-token"
              target="_blank"
              rel="noreferrer"
            >
              https://developer.spotify.com/documentation/web-api/concepts/access-token
            </a>{" "}
            and follow the instructions.
          </label>
        </div>
        <div className="select-container">
          <TextControl
            id="accessToken"
            placeholder="Paste your access token here"
            value={inputAccessToken}
            onChange={(e) => {
              setInputAccessToken(e.target.value);
              makeCookie({
                name: ACCESS_TOKEN_COOKIE,
                value: e.target.value,
                age: 60 * 60 * 24 * 30 * 2,
              });
            }}
            popupText="This is the access token that will be used to make requests to the Spotify API."
          />
        </div>
      </div>
      <Heading number={4} as={AsType.H2}>
        Logged In Status
      </Heading>
      <div className="section">
        <div className="label-container">
          <label htmlFor="isLoggedIn">
            Toggle the logged in status for the components
          </label>
        </div>
        <div className="select-container">
          <FormToggle
            id="isLoggedIn"
            name="isLoggedIn"
            checked={isLoggedInput}
            tabIndex={0}
            onChange={(e) => {
              setIsLogin(e.target.checked);
              setIsLoggedInput(e.target.checked);
            }}
          />
        </div>
      </div>
      <style jsx>{`
        :global(.modal) {
          overflow: auto;
        }
        .preferences-container {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin: 0 auto;
          max-width: 900px;
          padding: 16px 0px;
        }
        .section {
          display: grid;
          gap: 8px 24px;
          grid-template-columns: 1.8fr 1fr;
        }
        .label-container {
          align-items: center;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
        }
        label {
          box-sizing: border-box;
          margin-block: 0px;
          font-size: 0.875rem;
          font-weight: 400;
          color: #a7a7a7;
        }
        .select-container {
          align-items: center;
          display: flex;
          justify-content: flex-end;
          position: relative;
          width: 100%;
        }
        a {
          color: #fff;
          text-decoration: none;
          font-weight: 600;
        }
        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
