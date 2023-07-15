import { ReactElement } from "react";

import { IUseToggleHandlers } from "hooks/useToggle";

interface ITextToggleButtonProps {
  isToggle: boolean;
  toggleHandlers: IUseToggleHandlers;
  activeText: string;
  inactiveText: string;
}

export default function TextToggleButton({
  isToggle,
  toggleHandlers,
  activeText,
  inactiveText,
}: ITextToggleButtonProps): ReactElement {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleHandlers.toggle();
      }}
    >
      {isToggle ? activeText : inactiveText}
      <style jsx>{`
        button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          margin: 18px 0;
          font-weight: bold;
        }
        button:hover,
        button:focus {
          color: white;
        }
      `}</style>
    </button>
  );
}
