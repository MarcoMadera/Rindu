import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export enum CountDownType {
  DOTS = "dots",
  CIRCULAR = "circular",
}

export interface CountDownProps {
  duration: number;
  currentProgress: number;
  isPlaying: boolean;
  type?: CountDownType;
  startTime?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const CountDown = ({
  duration,
  currentProgress,
  isPlaying,
  type = CountDownType.CIRCULAR,
  startTime = 0,
  size = 32,
  strokeWidth = 3,
  color = "#ffffff",
}: CountDownProps): ReactElement | null => {
  const isDotType = type === CountDownType.DOTS;

  const { radius, circumference, fontSize } = useMemo(() => {
    const r = size / 2 - strokeWidth / 2;
    return {
      radius: r,
      circumference: 2 * Math.PI * r,
      fontSize: Math.max(size * 0.3, 12),
    } as const;
  }, [size, strokeWidth]);

  const circleRef = useRef<SVGCircleElement>(null);
  const animationRef = useRef<number>(null);
  const progressRef = useRef(currentProgress);
  const lastTimeRef = useRef<number | null>(null);
  const [countdownNumber, setCountdownNumber] = useState<number | null>(null);

  const paintCircle = () => {
    if (!circleRef.current) return false;
    const remainingTime = duration - progressRef.current;
    const progress = Math.max(0, Math.min(1, remainingTime / duration));
    circleRef.current.style.strokeDashoffset = `${
      circumference * (1 - progress)
    }`;
    circleRef.current.style.opacity = progress < 0.1 ? `${progress * 10}` : "1";

    const remainingSeconds = Math.ceil(remainingTime / 1000);
    setCountdownNumber(
      remainingSeconds > 0 && remainingSeconds <= 3 ? remainingSeconds : null
    );

    return progress > 0;
  };

  useEffect(() => {
    progressRef.current = currentProgress;
    if (!isDotType) paintCircle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProgress, duration, isDotType]);

  useEffect(() => {
    if (isDotType || !isPlaying) return;

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        progressRef.current += time - lastTimeRef.current;
      }
      lastTimeRef.current = time;
      if (paintCircle()) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      animationRef.current && cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDotType, isPlaying]);

  if (isDotType) {
    const inWindow =
      currentProgress >= startTime && currentProgress <= startTime + duration;
    const progress = inWindow
      ? Math.min(1, Math.max(0, (currentProgress - startTime) / duration))
      : 0;

    const total = progress * 3;
    const activeDot = Math.floor(total);
    const dotProgress = total - activeDot;

    const dotOpacity = (i: number) => {
      if (i < activeDot) return 1;
      if (i > activeDot) return 0.2;
      return 0.2 + dotProgress * 0.8;
    };

    const dotSize = Math.max(size * 0.1, 3);
    const gap = size * 0.15;

    return (
      <div
        style={{
          width: size,
          display: "flex",
          gap,
          alignItems: "center",
          visibility: inWindow ? "visible" : "hidden",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: dotOpacity(i),
              transition: "opacity 150ms linear",
            }}
          />
        ))}
      </div>
    );
  }

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
          strokeDashoffset={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {countdownNumber !== null && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            fill={color}
            fontSize={fontSize}
            fontWeight="bold"
          >
            {countdownNumber}
          </text>
        )}
      </svg>
    </div>
  );
};

export default CountDown;
