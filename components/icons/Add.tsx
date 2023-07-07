import {
  ReactElement,
  SVGProps,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useLottie } from "lottie-react";

import AddAnimation from "animations/add-circle.json";
import { handleAsyncError } from "utils";

export function Add(
  props: SVGProps<SVGSVGElement> & {
    handleClick?: () => Promise<boolean>;
    isAdded?: boolean;
    shouldUpdateList?: boolean;
  }
): ReactElement {
  const [isPlaying, setIsPlaying] = useState(false);
  const { View, goToAndPlay, animationItem, pause, goToAndStop } = useLottie(
    {
      animationData: AddAnimation,
      loop: 0,
      autoplay: false,
      onSegmentStart: () => {
        setIsPlaying(true);
      },
      onComplete: () => {
        setIsPlaying(false);
      },
    },
    {
      width: 24,
      height: 24,
    }
  );
  useEffect(() => {
    if (props.isAdded && props.shouldUpdateList && !isPlaying) {
      goToAndStop(50, true);
    }
  }, [goToAndStop, isPlaying, props.isAdded, props.shouldUpdateList]);

  useEffect(() => {
    animationItem?.addEventListener("enterFrame", () => {
      if (
        animationItem?.currentFrame > 50 &&
        animationItem?.currentFrame < 60
      ) {
        pause();
        setIsPlaying(false);
      }
    });
  }, [animationItem, pause]);

  const handleClick = useCallback(async () => {
    if (isPlaying) return;
    if (props.handleClick) {
      const res = await props.handleClick();
      if (res) {
        goToAndPlay(0);
      } else {
        goToAndPlay(60, true);
      }
    }
  }, [goToAndPlay, isPlaying, props]);

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
      onClick={handleAsyncError(handleClick)}
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
