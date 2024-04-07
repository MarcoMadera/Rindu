import {
  Dispatch,
  MouseEvent,
  MutableRefObject,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface SliderProps {
  title: string;
  valueText: string;
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
  onDragging?: (isDragging: boolean, progressPercent: number) => void;
  showDot?: boolean;
  className?: string;
}

export default function Slider({
  title,
  action,
  updateProgress,
  intervalUpdateAction,
  valueText,
  onDragging,
  setLabelValue,
  initialValuePercent,
  showDot,
  className,
}: SliderProps): ReactElement {
  const [progressPercent, setProgressPercent] = useState(initialValuePercent);
  const [isPressingMouse, setIsPressingMouse] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (typeof updateProgress === "number") {
      setProgressPercent(updateProgress);
    }
  }, [updateProgress]);

  useEffect(() => {
    if (onDragging) {
      onDragging(isDragging || isPressingMouse, progressPercent);
    }
    const update = intervalUpdateAction;
    if (
      !update ||
      (!isDragging && !isPressingMouse && !update.shouldUpdate) ||
      !update.shouldUpdate
    ) {
      return;
    }
    let newValue: number | undefined;
    const playerInterval = setInterval(() => {
      if (isDragging || !setLabelValue || !update.shouldUpdate) {
        clearInterval(playerInterval);
        return;
      }
      newValue = progressPercent + update.steps;
      if (newValue >= 100) {
        clearInterval(playerInterval);
        newValue = 100;
      }

      setLabelValue((value) => value + update.labelUpdateValue);
    }, update.ms);

    if (newValue) {
      setProgressPercent(newValue);
    }

    return () => {
      clearInterval(playerInterval);
      if (setLabelValue && !intervalUpdateAction.shouldUpdate) {
        setLabelValue(0);
      }
    };
  }, [
    intervalUpdateAction,
    intervalUpdateAction?.shouldUpdate,
    isDragging,
    isPressingMouse,
    setLabelValue,
    onDragging,
    progressPercent,
  ]);

  const getMyCurrentPositionPercent = useCallback(
    (e: MouseEvent | globalThis.MouseEvent) => {
      const myposition = e.pageX;
      const sliderPositionX = sliderRef.current?.parentElement?.offsetLeft ?? 0;
      const sliderWidth = sliderRef.current?.clientWidth ?? 0;
      const sliderXEnd = sliderPositionX + sliderWidth;
      const myPositionInSlider =
        myposition > sliderXEnd
          ? sliderWidth
          : myposition < sliderPositionX
            ? 0
            : myposition - sliderPositionX;
      const currentPositionPercent = (myPositionInSlider * 100) / sliderWidth;
      return currentPositionPercent;
    },
    []
  );

  useEffect(() => {
    if (!isPressingMouse) {
      return;
    }

    function handleDrag(e: globalThis.MouseEvent) {
      e.preventDefault();
      const currentPositionPercent = getMyCurrentPositionPercent(e);
      setIsDragging(true);
      setProgressPercent(currentPositionPercent);
    }

    function handleDragEnd() {
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
    getMyCurrentPositionPercent,
  ]);

  return (
    <div className={`barContainer ${className ?? ""}`}>
      <div
        className="transformation"
        role="slider"
        aria-valuetext={valueText}
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={title}
        tabIndex={0}
        ref={sliderRef as MutableRefObject<HTMLDivElement>}
        onMouseMove={(e) => {
          e.stopPropagation();
          if (isPressingMouse) {
            const currentPositionPercent = getMyCurrentPositionPercent(e);
            setProgressPercent(currentPositionPercent);
          }
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsPressingMouse(true);
          setProgressPercent(
            ((e.pageX - (sliderRef.current?.parentElement?.offsetLeft ?? 0)) *
              100) /
              (sliderRef.current?.clientWidth ?? 0)
          );
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          if (isPressingMouse) {
            setIsDragging(true);
          }
        }}
        onMouseUp={(e) => {
          e.stopPropagation();
          action(progressPercent);
          setIsPressingMouse(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onKeyUp={(e) => {
          if (e.key === "ArrowRight") {
            setProgressPercent((value) => (value >= 100 ? 100 : value + 1));
            action(progressPercent >= 100 ? 100 : progressPercent + 1);
          } else if (e.key === "ArrowLeft") {
            setProgressPercent((value) => (value <= 0 ? 0 : value - 1));
            action(progressPercent <= 0 ? 0 : progressPercent - 1);
          }
        }}
      >
        <div className="barBackground">
          <div className="lineContainer">
            <div
              className="slider-line"
              style={{
                transform: `translateX(calc(-100% + ${progressPercent}%))`,
              }}
            ></div>
          </div>
          <div
            className="dot"
            style={{
              left: `${progressPercent}%`,
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
          background-color: #ffffff75;
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
        .slider-line {
          border-radius: 2px;
          height: 4px;
          width: 100%;
          user-select: none;
        }
        .transformation:hover .slider-line {
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
        .slider-line {
          background-color: ${isPressingMouse || showDot ? "#1db954" : "#fff"};
        }
      `}</style>
    </div>
  );
}
