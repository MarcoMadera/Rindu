import {
  Dispatch,
  MutableRefObject,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface SliderProps {
  value: number;
  valueText: string;
  maxValue: number;
  initialValuePercent: number;
  setLabelValue?: Dispatch<SetStateAction<number>>;
  action: (progressPercent: number) => void;
  updateProgress?: number;
  intervalUpdateAction?: {
    ms: number;
    labelUpdateValue: number;
    steps: number;
    shouldUpdate: boolean;
  };
  onProgressChange: (currentPositionPercent: number) => void;
  onDragging?: (isDragging: boolean) => void;
  showDot?: boolean;
}

export default function Slider({
  action,
  updateProgress,
  intervalUpdateAction,
  value,
  valueText,
  maxValue,
  onProgressChange,
  onDragging,
  setLabelValue,
  initialValuePercent,
  showDot,
}: SliderProps): ReactElement {
  const [progressPercent, setProgressPercent] = useState(initialValuePercent);
  const [isPressingMouse, setIsPressingMouse] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPositionX, setSliderPositionX] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (typeof updateProgress === "number") {
      setProgressPercent(
        Math.ceil(updateProgress) > 100 ? 100 : Math.ceil(updateProgress)
      );
    }
  }, [updateProgress]);

  useEffect(() => {
    if (onDragging) {
      onDragging(isDragging || isPressingMouse);
    }
    const update = intervalUpdateAction;
    if (!update || (!isDragging && !isPressingMouse && !update.shouldUpdate)) {
      return;
    }
    const playerInterval = setInterval(() => {
      if (!isDragging && setLabelValue) {
        setProgressPercent((value) =>
          value >= 100 ? 0 : value + update.steps
        );
        setLabelValue((value) => value + update.labelUpdateValue);
      }
    }, update.ms);

    return () => clearInterval(playerInterval);
  }, [
    intervalUpdateAction,
    intervalUpdateAction?.shouldUpdate,
    isDragging,
    isPressingMouse,
    setLabelValue,
    onDragging,
  ]);

  const getMyCurrentPositionPercent = useCallback(
    (e) => {
      const myposition = e.screenX;
      const myPositionInSlider =
        myposition > sliderPositionX + sliderWidth
          ? sliderWidth
          : myposition < sliderPositionX
          ? 0
          : myposition - sliderPositionX;
      const currentPositionPercent = (myPositionInSlider * 100) / sliderWidth;
      return currentPositionPercent;
    },
    [sliderPositionX, sliderWidth]
  );

  useEffect(() => {
    if (!isPressingMouse) {
      return;
    }

    function handleDrag(e: MouseEvent) {
      e.preventDefault();
      const currentPositionPercent = getMyCurrentPositionPercent(e);
      setIsDragging(true);
      onProgressChange(currentPositionPercent);
      setProgressPercent(currentPositionPercent);
    }

    function handleDragEnd(e: MouseEvent) {
      e.preventDefault();
      action(progressPercent);
      setIsPressingMouse(false);
      setIsDragging(false);
    }

    if (!isDragging) {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
      return;
    }

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);

    return () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [
    isPressingMouse,
    action,
    isDragging,
    progressPercent,
    sliderPositionX,
    sliderWidth,
    onProgressChange,
    getMyCurrentPositionPercent,
  ]);

  // Remove this because won't change resizing the screen
  useEffect(() => {
    setSliderWidth(sliderRef.current?.clientWidth ?? 0);
    setSliderPositionX(sliderRef.current?.parentElement?.offsetLeft ?? 0);
  }, []);

  return (
    <div className="barContainer">
      <label>
        <input
          type="range"
          min="0"
          max={maxValue}
          step="5"
          aria-valuetext={valueText}
          value={value}
          readOnly
        />
      </label>
      <div
        className="transformation"
        role="slider"
        aria-valuenow={progressPercent}
        tabIndex={0}
        ref={sliderRef as MutableRefObject<HTMLDivElement>}
        onMouseMove={(e) => {
          if (isPressingMouse) {
            setProgressPercent(
              ((e.screenX - sliderPositionX) * 100) / sliderWidth
            );
            const currentPositionPercent = getMyCurrentPositionPercent(e);
            setProgressPercent(currentPositionPercent);
            onProgressChange(currentPositionPercent);
          }
        }}
        onMouseDown={(e) => {
          setIsPressingMouse(true);
          setProgressPercent(
            ((e.screenX - sliderPositionX) * 100) / sliderWidth
          );
          const currentPositionPercent = getMyCurrentPositionPercent(e);
          onProgressChange(currentPositionPercent);
        }}
        onMouseLeave={(e) => {
          if (isPressingMouse) {
            setIsDragging(true);
            const currentPositionPercent = getMyCurrentPositionPercent(e);
            onProgressChange(currentPositionPercent);
          }
        }}
        onMouseUp={() => {
          action(progressPercent);
          setIsPressingMouse(false);
        }}
      >
        <div className="barBackground">
          <div className="lineContainer">
            <div
              className="line"
              style={{
                transform: `translateX(calc(-100% + ${
                  progressPercent >= 100 ? 100 : progressPercent
                }%))`,
              }}
            ></div>
          </div>
          <div
            className="dot"
            style={{
              left: `${progressPercent >= 100 ? 100 : progressPercent}%`,
            }}
          ></div>
        </div>
      </div>
      <style jsx>{`
        label {
          clip: rect(0 0 0 0);
          border: 0;
          height: 1px;
          margin: -1px;
          overflow: hidden;
          padding: 0;
          position: absolute;
          width: 1px;
        }
        .barContainer {
          height: 12px;
          position: relative;
          width: 100%;
        }
        .transformation {
          height: 100%;

          touch-action: none;
          width: 100%;
        }
        .barBackground {
          border-radius: 2px;
          height: 4px;
          width: 100%;
          display: flex;
          background-color: #535353;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
        .lineContainer {
          border-radius: 2px;
          height: 4px;
          width: 100%;
          overflow: hidden;
          z-index: 900;
          position: relative;
        }
        .line {
          border-radius: 2px;
          height: 4px;
          width: 100%;
          user-select: none;
        }
        .transformation:hover .line {
          background-color: #1db954;
          user-select: none;
        }
        .transformation:focus-visible {
          outline: none;
        }
        .transformation .dot {
          display: none;
          background-color: #fff;
          border: 0;
          border-radius: 50%;
          height: 12px;
          right: 0px;
          margin-left: -6px;
          box-shadow: 0 2px 4px 0 rgb(0 0 0 / 50%);
          transform: translateY(-50%);
          top: 50%;
          position: absolute;
          z-index: 900;
          width: 12px;
          user-select: none;
        }
        .transformation:hover .dot {
          display: block;
        }
      `}</style>
      <style jsx>{`
        .transformation .dot {
          display: ${isPressingMouse || showDot ? "block" : "none"};
        }
        .line {
          background-color: ${isPressingMouse || showDot
            ? "#1db954"
            : "#b3b3b3"};
        }
      `}</style>
    </div>
  );
}