import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactElement,
  useState,
} from "react";

export default function FormToggle(
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { popupText?: string }
): ReactElement {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { popupText = "", ...restProps } = props;

  return (
    <div className="form-toggle">
      <input
        type="checkbox"
        className="toggle-input"
        id={props.id}
        {...restProps}
      />
      {/* eslint-disable-next-line  jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/label-has-associated-control*/}
      <label
        htmlFor={props.id}
        className="toggle-text"
        onMouseEnter={() => {
          if (props.disabled) {
            setIsPopupOpen(true);
          }
        }}
        onMouseLeave={() => {
          setIsPopupOpen(false);
        }}
      >
        <span></span>
      </label>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
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
      <style jsx>{`
        .form-toggle {
          display: inline-block;
          position: relative;
          width: 50px;
          height: 24px;
        }
        .toggle-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }
        .toggle-text {
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: #666;
          border-radius: 50px;
          transition: background-color 0.2s ease;
        }
        .toggle-input:hover + .toggle-text,
        .toggle-text:hover {
          background-color: #9f9f9f;
        }
        .toggle-text::before {
          content: "";
          display: block;
          width: 20px;
          height: 20px;
          background-color: #fff;
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: transform 0.2s ease;
        }
        .toggle-input:checked + .toggle-text {
          background-color: #1ed760;
        }
        .toggle-input:checked:focus:not(:hover) + .toggle-text {
          background-color: #169c46;
        }
        .toggle-input:focus:not(:hover) + .toggle-text {
          background-color: #9f9f9f;
        }
        .toggle-input:checked:hover + .toggle-text,
        .toggle-input:checked:focus:active + .toggle-text {
          background-color: #1fdf64;
        }
        .toggle-input:disabled + .toggle-text {
          background: #3a3a3a;
        }
        .toggle-input:disabled + .toggle-text:before {
          background: #999999;
        }
        .toggle-input:active:checked + .toggle-text,
        .toggle-input:checked:active + .toggle-text {
          background-color: #169c46;
        }
        .toggle-input:checked + .toggle-text::before {
          transform: translateX(26px);
        }
        .toggle-input:checked:focus + .toggle-text::before {
          outline: none;
        }
        .helpText {
          position: absolute;
          top: -4rem;
          transform: translateX(-50%);
          left: 50%;
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
      `}</style>
    </div>
  );
}
