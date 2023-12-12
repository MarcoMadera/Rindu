import { DetailedHTMLProps, InputHTMLAttributes, ReactElement } from "react";

export default function FormToggle(
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
): ReactElement {
  return (
    <div className="form-toggle">
      <input
        type="checkbox"
        className="toggle-input"
        id={props.id}
        {...props}
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={props.id} className="toggle-text">
        <span></span>
      </label>
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
      `}</style>
    </div>
  );
}
