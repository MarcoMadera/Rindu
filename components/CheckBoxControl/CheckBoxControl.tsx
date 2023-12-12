import { DetailedHTMLProps, InputHTMLAttributes, ReactElement } from "react";

export default function CheckBoxControl(
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
): ReactElement {
  return (
    <div className="checkbox-container">
      <input type="checkbox" {...props} />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={props.id}>
        <span></span>
      </label>
      <style jsx>{`
        div {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
          -webkit-box-align: center;
          align-items: center;
          display: flex;
          padding-block: 4px;
          position: relative;
          min-block-size: 32px;
        }
        input {
          background: hsla(0, 0%, 100%, 0.1);
          border-radius: 4px;
          color: hsla(0, 0%, 100%, 0.7);
          font-size: 14px;
          height: 32px;
          padding: 0 12px;
          text-align: left;
          width: 100%;
          border: 0px;
          clip: rect(0px, 0px, 0px, 0px);
          height: 1px;
          margin: -1px;
          overflow: hidden;
          padding: 0px;
          position: absolute;
          width: 1px;
        }
        label {
          display: flex;
          position: relative;
          min-inline-size: 0px;
        }
        span {
          box-sizing: border-box;
          background: transparent;
          border-radius: 3px;
          display: inline-block;
          block-size: 16px;
          user-select: none;
          inline-size: 16px;
          flex-shrink: 0;
          align-self: flex-start;
          top: 0px;
          position: relative;
          background-color: #121212;
        }
        input:not(:checked) + label span {
          border: 1px solid #727272;
        }
        input:focus + label span,
        input:not(:checked):hover + label span {
          border-color: #1ed760;
        }
        input:not(:checked):active + label span {
          border-color: #1ed760;
          border-width: 2px;
        }
        input:checked + label span {
          background-color: #1ed760;
          border-width: 0px;
        }
        input:checked + label span::before {
          box-sizing: border-box;
          background-color: unset;
          border-bottom-width: 2px;
          border-bottom-style: solid;
          border-left-width: 2px;
          border-left-style: solid;
          border-color: #121212;
          display: block;
          content: "";
          block-size: 5px;
          inline-size: 9px;
          position: absolute;
          top: 46%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0px) rotate(-48deg);
        }
      `}</style>
    </div>
  );
}
