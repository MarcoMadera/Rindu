import {
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { LottieOptions, useLottie } from "lottie-react";

import dislikeAnimation from "animations/dislike.json";
import likeAnimation from "animations/like.json";
import { wait } from "utils/wait";

export default function Heart({
  active,
  handleLike,
  handleDislike,
  options,
  style,
  ...props
}: {
  active: boolean | string;
  handleLike?: () => Promise<true | null>;
  handleDislike?: () => Promise<true | null>;
  options?: LottieOptions;
  style?: CSSProperties;
} & HTMLAttributes<HTMLButtonElement>): ReactElement {
  const [defaultActiveValue, setDefaultActiveValue] = useState(active);
  const [isPlaying, setIsPlaying] = useState(false);
  const data = useMemo(
    () => ({
      animationData: defaultActiveValue ? dislikeAnimation : likeAnimation,
      loop: false,
      autoplay: false,
      ...options,
    }),
    [defaultActiveValue, options]
  );
  const { View, getDuration, play, animationLoaded } = useLottie(data, {
    width: 32,
    height: 32,
    ...style,
  });

  useEffect(() => {
    setDefaultActiveValue(active);
  }, [active]);

  const playAnimationAndSetValue = useCallback(
    (value: boolean) => {
      play();
      const duration = getDuration();
      if (!duration) return setIsPlaying(false);
      wait(duration * 1000 - 100).then(() => {
        setDefaultActiveValue(value);
        setIsPlaying(false);
      });
    },
    [getDuration, play]
  );

  if (handleLike && handleDislike) {
    return (
      <button
        aria-label={defaultActiveValue ? "Dislike" : "Like"}
        disabled={isPlaying || !animationLoaded}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsPlaying(true);
          if (defaultActiveValue) {
            handleDislike().then((res) => {
              if (!res) return setIsPlaying(false);
              playAnimationAndSetValue(false);
            });
          } else {
            handleLike().then((res) => {
              if (!res) return setIsPlaying(false);
              playAnimationAndSetValue(true);
            });
          }
        }}
        {...props}
      >
        {View}
        <style jsx>{`
          button {
            background-color: transparent;
            border: none;
          }
          button:hover {
            transform: scale(1.06);
          }
          button :global(svg > g > g:nth-child(5) path),
          button :global(svg > g > g:nth-child(7) path),
          button :global(svg > g > g:nth-child(8) path) {
            fill: #ffffffb3;
            stroke: #ffffffb3;
            stroke-width: 20px;
          }
          button:hover :global(svg > g > g:nth-child(5) path),
          button:hover :global(svg > g > g:nth-child(7) path),
          button:hover :global(svg > g > g:nth-child(8) path) {
            fill: #fff;
            stroke: #fff;
          }
          button:active {
            transform: scale(1);
          }
        `}</style>
      </button>
    );
  }

  return (
    <div>
      {View}
      <style jsx>{`
        div :global(svg path) {
          fill: ${typeof props.color === "string" ? props.color : "#ffffffb3"};
        }
      `}</style>
    </div>
  );
}
