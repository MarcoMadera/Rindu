import { ReactElement, SVGProps } from "react";

import { useFullScreenControl, useSpotify } from "hooks";
import { DisplayInFullScreen } from "types/spotify";

type Props = {
  icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
  displayInFullScreen: DisplayInFullScreen;
};

export default function FullScreenControl({
  icon,
  displayInFullScreen,
}: Props): ReactElement {
  const { setDisplayInFullScreen } = useFullScreenControl(displayInFullScreen);
  const isVisible = useSpotify().displayInFullScreen === displayInFullScreen;

  return (
    <>
      <button
        type="button"
        className="button full-screen-control"
        aria-label={isVisible ? "Hide" : "Show"}
        onClick={(e) => {
          e.stopPropagation();
          setDisplayInFullScreen(!isVisible);
        }}
      >
        {icon({ fill: isVisible ? "#1db954" : "#ffffffb3" })}
      </button>
      <style jsx>{`
        button {
          color: ${isVisible ? "#1db954" : "#ffffffb3"};
        }
      `}</style>
      <style jsx>{`
        .full-screen-control:hover :global(svg path) {
          fill: #fff;
        }
        button {
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          background-color: transparent;
          position: relative;
          width: 32px;
          height: 32px;
        }
      `}</style>
    </>
  );
}
