import { DetailedHTMLProps, ReactElement, SelectHTMLAttributes } from "react";

interface ISelectOption {
  label: string;
  value: string;
}

interface ISelectControlProps
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  options: ISelectOption[];
}

export default function SelectControl({
  options,
  ...props
}: ISelectControlProps): ReactElement {
  return (
    <span className="select-control">
      <select {...props}>
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <span className="arrow-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M16 10l-4 4-4-4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="square"
            strokeWidth="2"
          ></path>
        </svg>
      </span>
      <style jsx>{`
        .select-control {
          position: relative;
          display: block;
        }
        select {
          appearance: none;
          background-color: #333;
          border: 0;
          border-radius: 4px;
          color: #ffffffb3;
          font-size: 14px;
          font-weight: 400;
          height: 32px;
          letter-spacing: 0.24px;
          line-height: 20px;
          padding: 0 32px 0 12px;
          width: 100%;
        }
        .arrow-container {
          width: 18px;
          height: 18px;
          display: block;
          margin-top: -8px;
          position: absolute;
          right: 4px;
          top: 50%;
          color: #afafaf;
          pointer-events: none;
        }
      `}</style>
    </span>
  );
}
