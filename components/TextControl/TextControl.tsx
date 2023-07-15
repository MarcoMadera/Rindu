import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactElement,
  useState,
} from "react";

import css from "styled-jsx/css";

interface ITextControlProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  popupText?: string;
  variant?: "empty" | "default";
}

const defaultInput = css`
  .text-input-size {
    -webkit-box-flex: 1;
    -ms-flex: 1 0;
    flex: 1 0;
    position: relative;
  }
  .text-input-size input {
    background: #ffffff1a;
    border: 1px solid transparent;
    border-radius: 4px;
    color: #ffffffb3;
    font-size: 14px;
    height: 32px;
    padding: 0 36px 0 12px;
    text-align: left;
    width: 100%;
  }
  .helpButton {
    box-sizing: border-box;
    font-size: 0.8125rem;
    background-color: transparent;
    border: 0px;
    border-radius: 500px;
    cursor: pointer;
    color: #8b8b8b;
    margin-top: -8px;
    position: absolute;
    right: 4px;
    top: 25%;
  }
  .helpButton:hover {
    transform: scale(1.04);
    color: #fff;
  }
  .helpButton:active {
    opacity: 0.7;
    outline: none;
    transform: scale(1);
    color: #6a6a6a;
  }
  .helpButton span {
    display: flex;
    padding: 8px;
  }
  .helpText {
    position: absolute;
    right: 10px;
    top: 20px;
    visibility: hidden;
    width: 240px;
    z-index: 2;
  }
  .helpText div {
    background: #282828;
    box-shadow: 0 4px 4px #00000040;
    font-size: 12px;
    color: #f0f0f0;
    box-sizing: border-box;
    border-radius: 8px;
    text-align: start;
    cursor: default;
    display: inline-block;
    max-inline-size: 240px;
    position: relative;
    font-weight: 400;
    padding: 8px 12px;
    text-transform: initial;
    overflow-wrap: break-word;
    line-height: 1.5;
  }
  .visible {
    visibility: visible;
  }
`;

const emptyInput = css`
  input[type="text"][disabled] {
    opacity: 0.3;
  }
  input[type="text"] {
    width: auto;
    background: transparent;
    border: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    color: inherit;
    max-width: 200px;
    text-decoration: underline;
    margin-top: 2px;
  }
  input[type="text"]:focus {
    outline: none;
  }
`;

const inputStyles = {
  empty: emptyInput,
  default: defaultInput,
};

export default function TextControl({
  popupText,
  variant = "default",
  ...props
}: ITextControlProps): ReactElement {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const style = inputStyles[variant];
  return (
    <div className="text-input-size">
      <input type="text" {...props} />
      {popupText && (
        <>
          <button
            type="button"
            className="helpButton"
            onMouseEnter={() => {
              setIsPopupOpen(true);
            }}
            onMouseLeave={() => {
              setIsPopupOpen(false);
            }}
          >
            <span className="icon-wrapper">
              <svg
                role="img"
                height="16"
                width="16"
                aria-hidden="true"
                viewBox="0 0 16 16"
              >
                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
                <path d="M7.25 12.026v-1.5h1.5v1.5h-1.5zm.884-7.096A1.125 1.125 0 0 0 7.06 6.39l-1.431.448a2.625 2.625 0 1 1 5.13-.784c0 .54-.156 1.015-.503 1.488-.3.408-.7.652-.973.818l-.112.068c-.185.116-.26.203-.302.283-.046.087-.097.245-.097.57h-1.5c0-.47.072-.898.274-1.277.206-.385.507-.645.827-.846l.147-.092c.285-.177.413-.257.526-.41.169-.23.213-.397.213-.602 0-.622-.503-1.125-1.125-1.125z"></path>
              </svg>
            </span>
          </button>
          <div
            className={`helpText ${isPopupOpen ? "visible" : ""}`}
            onMouseEnter={() => {
              setIsPopupOpen(true);
            }}
            onMouseLeave={() => {
              setIsPopupOpen(false);
            }}
          >
            <div>{popupText}</div>
          </div>
        </>
      )}
      <style jsx>{style}</style>
    </div>
  );
}
