import { useLottie } from "lottie-react";
import { ReactElement, SVGProps } from "react";
import AddAnimation from "animations/add-circle.json";
export default function Add(
  props: SVGProps<SVGSVGElement> & {
    handleClick?: () => Promise<boolean>;
  }
): ReactElement {
  const { View, playSegments } = useLottie(
    {
      animationData: AddAnimation,
      loop: false,
      autoplay: false,
      initialSegment: [0, 1],
    },
    {
      width: 24,
      height: 24,
    }
  );

  if (!props.handleClick) {
    return (
      <svg height="12" width="12" viewBox="0 0 16 16" {...props}>
        <path d="M14 7H9V2H7v5H2v2h5v5h2V9h5z"></path>
        <path fill="none" d="M0 0h16v16H0z"></path>
      </svg>
    );
  }

  return (
    <button
      type="button"
      aria-label="Add"
      onClick={async () => {
        if (props.handleClick) {
          const res = await props.handleClick();
          if (res) {
            playSegments([0, 60]);
          }
          if (!res) {
            playSegments([60, 90]);
          }
        }
      }}
    >
      {View}
      <style jsx>{`
        button {
          position: relative;
          background: none;
          border: none;
          display: block;
          width: 24px;
          height: 24px;
          max-width: 24px;
          max-height: 24px;
          overflow: hidden;
        }
        button :global(div) {
          position: absolute;
          transform: scale(5.6);
          top: 0;
          left: 0;
          display: inline-block;
        }
        button:hover :global(svg > g > g:nth-child(1) path),
        button:hover :global(svg > g > g:nth-child(2) path:nth-child(1)) {
          stroke: #fff;
        }
      `}</style>
    </button>
  );
}
