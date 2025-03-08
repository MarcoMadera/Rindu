import React, { ReactElement, useEffect, useRef } from "react";

export const CountDown = ({
  startTime,
  currentProgress,
  isPlaying,
  size = 32,
  strokeWidth = 3,
  color = "#ffffff",
}: {
  startTime: number;
  currentProgress: number;
  isPlaying: boolean;
  size?: number;
  strokeWidth?: number;
  color?: string;
}): ReactElement | null => {
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const circleRef = useRef<SVGCircleElement>(null);
  const animationRef = useRef<number>(null);
  const progressRef = useRef(currentProgress);
  const lastTimeRef = useRef<number>(null);

  const updateCircle = () => {
    if (!circleRef.current) return;

    const remainingTime = startTime - progressRef.current;
    const totalDuration = startTime;

    const progress = Math.max(0, Math.min(1, remainingTime / totalDuration));
    const dashOffset = circumference * (1 - progress);

    circleRef.current.style.strokeDashoffset = dashOffset.toString();

    if (progress < 0.1) {
      circleRef.current.style.opacity = (progress * 10).toString(); // Fade out in last 10%
    } else {
      circleRef.current.style.opacity = "1";
    }

    if (progress <= 0) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    progressRef.current = currentProgress;

    updateCircle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProgress, startTime]);

  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current && isPlaying) {
        const deltaTime = time - lastTimeRef.current;

        progressRef.current += deltaTime;
      }

      lastTimeRef.current = time;

      if (updateCircle()) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <div className="countdown-container" style={{ width: size, height: size }}>
      <svg
        style={{ width: "100%", height: "100%" }}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset="0"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default CountDown;
