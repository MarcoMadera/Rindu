import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactElement,
  useEffect,
  useRef,
} from "react";

import { Delete, Search } from "components/icons";
import { useToggle } from "hooks";

interface SearchInputProps {
  handleDeleteSearch: () => void;
  hide?: boolean;
}

export default function SearchInput({
  hide,
  handleDeleteSearch,
  ...props
}: SearchInputProps &
  DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >): ReactElement {
  const [showInput, setShowInput] = useToggle(!hide);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!ref.current || !showInput) return;
    ref.current.focus();
  }, [showInput]);
  return (
    <div
      className={`search-input-container ${
        showInput ? "expanded" : "collapsed"
      }`}
    >
      <div className="search-control">
        <Search width={"16px"} height={"16px"} fill={"#ffffffb3"} />
        <input
          type="text"
          {...props}
          onBlur={(e) => {
            props.onBlur?.(e);
            setShowInput.reset();
          }}
          ref={ref}
          tabIndex={showInput ? 0 : -1}
        />
        {props.value ? (
          <button
            onClick={() => {
              handleDeleteSearch();
              ref.current?.focus();
            }}
            className="delete"
          >
            <Delete width={"16px"} height={"16px"} fill={"#ffffffb3"} />
          </button>
        ) : null}
      </div>
      <button
        onClick={() => {
          setShowInput.toggle();
        }}
        tabIndex={!showInput ? 0 : -1}
        className="search"
      >
        <Search width={"16px"} height={"16px"} fill={"#ffffffb3"} />
      </button>
      <style jsx>{`
        .search-input-container {
          max-width: 100%;
          width: 100%;
          position: relative;
          height: 40px;
          display: flex;
          align-items: center;
          overflow: hidden;
          transition: margin-left 0.4s ease-out;
          display: grid;
        }
        .search-input-container.collapsed {
          display: grid;
          grid-auto-flow: column;
        }
        button {
          border: 0;
          border-radius: 500px;
          background-color: transparent;
          color: #ffffffb3;
          text-overflow: ellipsis;
          width: 32px;
          height: 32px;
          font-size: 0.875rem;
          font-weight: 400;
          letter-spacing: normal;
          line-height: 16px;
          text-transform: none;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: opacity 0.4s ease-out;
          margin: 0 2px 0 -40px;
        }
        button.search:hover {
          color: #ffffff;
          background-color: #ffffff1a;
        }
        button.delete {
          border-radius: 0px;
          margin: 0 0px 0 -34px;
        }
        .search-input-container.expanded button.search {
          opacity: 0;
        }
        .search-input-container.expanded button.search :global(svg) {
          opacity: 0;
          transition: opacity 0.4s ease-out;
        }
        .search-input-container.collapsed button.search {
          opacity: 1;
        }
        .search-input-container.expanded :global(.search-control) {
          margin-left: 0;
        }
        .search-input-container.collapsed :global(.search-control > svg) {
          opacity: 0;
        }
        .search-input-container.collapsed :global(.search-control input) {
          opacity: 0;
        }
        .search-control {
          margin-left: calc(100% + 40px);
          display: flex;
          align-items: center;
          transition: margin-left 0.4s ease-out;
        }
        .search-control input {
          border: 0;
          border-radius: 4px;
          background-color: #ffffff1a;
          color: #ffffffb3;
          height: 40px;
          padding: 4px 36px;
          text-overflow: ellipsis;
          width: 100%;
          font-size: 0.875rem;
          font-weight: 400;
          letter-spacing: normal;
          line-height: 16px;
          text-transform: none;
          transition: opacity 0.4s ease-out;
          margin-left: -16px;
        }
        .search-control input:focus {
          outline: none;
        }
        .search-control > :global(svg) {
          display: flex;
          align-items: center;
          transform: translateX(12px);
          pointer-events: none;
          height: 100%;
          border: 0;
          margin: 0;
          padding: 0;
          vertical-align: baseline;
          transition: opacity 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
