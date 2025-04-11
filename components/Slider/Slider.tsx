import {
  Dispatch,
  MouseEvent,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import css from "styled-jsx/css";

import { isServer } from "utils";

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
    maxLabelValue: number;
  };
  onDragging?: (isDragging: boolean, progressPercent: number) => void;
  showDot?: boolean;
  className?: string;
  document?: Document;
}

export const styles = css.global`
  .barContainer label {
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
    background-color: #fff;
  }
  .transformation:hover .slider-line,
  .transformation .slider-line.hover {
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
  .transformation:hover .dot,
  .transformation .dot.hover {
    display: block !important;
  }
`;

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
  document = isServer() ? undefined : window.document,
}: Readonly<SliderProps>): ReactElement {
  const [progressPercent, setProgressPercent] = useState(initialValuePercent);
  const [isPressingMouse, setIsPressingMouse] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof updateProgress === "number") {
      setProgressPercent(updateProgress);
    }
  }, [updateProgress]);

  useEffect(() => {
    if (isDragging && onDragging) {
      onDragging(isDragging || isPressingMouse, progressPercent);
    }
  }, [onDragging, isDragging, isPressingMouse, progressPercent]);

  useEffect(() => {
    if (
      !intervalUpdateAction?.ms ||
      (!isDragging && !isPressingMouse && !intervalUpdateAction.shouldUpdate) ||
      !intervalUpdateAction.shouldUpdate
    ) {
      return;
    }
    let newValue: number | undefined;
    const playerInterval = setInterval(() => {
      if (isDragging || !setLabelValue || !intervalUpdateAction.shouldUpdate) {
        clearInterval(playerInterval);
        return;
      }
      newValue = progressPercent + intervalUpdateAction.steps;
      if (newValue >= 100) {
        clearInterval(playerInterval);
        setProgressPercent(0);
        setLabelValue(0);
        newValue = 0;
        return;
      }

      setLabelValue((value) => {
        const newLabelValue = value + intervalUpdateAction.labelUpdateValue;
        return newLabelValue;
      });
      setProgressPercent(newValue);
    }, intervalUpdateAction.ms);

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
    setLabelValue,
    progressPercent,
    intervalUpdateAction?.shouldUpdate,
    intervalUpdateAction?.ms,
    intervalUpdateAction?.steps,
    intervalUpdateAction?.maxLabelValue,
    intervalUpdateAction?.labelUpdateValue,
    isDragging,
    isPressingMouse,
  ]);

  const getMyCurrentPositionPercent = useCallback(
    (e: MouseEvent | globalThis.MouseEvent) => {
      const myposition = e.pageX;

      const sliderElement = sliderRef.current;
      const parentElement = sliderElement?.parentElement;

      const sliderRect = sliderElement?.getBoundingClientRect();
      const parentRect = parentElement?.getBoundingClientRect();

      const sliderPositionX = parentRect?.left ?? 0;
      const sliderWidth = sliderRect?.width ?? 0;
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
      document?.removeEventListener("mousemove", handleDrag);
      document?.removeEventListener("mouseup", handleDragEnd);
      return;
    }

    document?.addEventListener("mousemove", handleDrag);
    document?.addEventListener("mouseup", handleDragEnd);

    return () => {
      document?.removeEventListener("mousemove", handleDrag);
      document?.removeEventListener("mouseup", handleDragEnd);
    };
  }, [
    document,
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
        ref={sliderRef}
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
          const rect = sliderRef.current?.getBoundingClientRect();
          const percent =
            ((e.clientX - (rect?.left ?? 0)) * 100) / (rect?.width ?? 1);
          setProgressPercent(percent);
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
              className={`slider-line ${isPressingMouse || showDot ? "hover" : ""}`}
              style={{
                transform: `translateX(calc(-100% + ${progressPercent}%))`,
              }}
            ></div>
          </div>
          <div
            className={`dot ${isPressingMouse || showDot ? "hover" : ""}`}
            style={{
              left: `${progressPercent}%`,
            }}
          ></div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
