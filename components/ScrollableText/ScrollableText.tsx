import { PropsWithChildren, ReactElement, useEffect, useRef } from "react";

interface IScrollableText {
  speedPxSeconds?: number;
  delay?: number;
}

export default function ScrollableText({
  children,
  speedPxSeconds = 20,
  delay = 5000,
}: PropsWithChildren<IScrollableText>): ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let direction = -1;
    if (!ref.current) return;

    const container = ref.current;
    const text = container.firstElementChild as HTMLElement;
    const distanceToMove = -(text.scrollWidth - text.offsetWidth);

    let lastTime: number | undefined;
    let animationFrameId: number;
    let distanceMoved = 0;
    let delayedTimerId: NodeJS.Timeout | undefined;
    text.style.transform = "translateX(0px)";

    if (text.scrollWidth <= container.offsetWidth) return;

    const update = (timestamp: number) => {
      const elapsedTime = lastTime ? timestamp - lastTime : 0;
      distanceMoved += (direction * speedPxSeconds * elapsedTime) / 1000;
      lastTime = timestamp;

      function setNewAnimationFrame(delay?: number) {
        if (!delay) {
          animationFrameId = requestAnimationFrame(update);
          return;
        }
        delayedTimerId = setTimeout(() => {
          lastTime = undefined;
          animationFrameId = requestAnimationFrame(update);
        }, delay);
      }

      function switchDirection() {
        direction = -direction;
        setNewAnimationFrame(delay);
      }

      if (distanceMoved < distanceToMove) {
        text.style.transform = `translateX(${distanceToMove}px)`;
        distanceMoved = distanceToMove;
        switchDirection();
        return;
      }

      if (distanceMoved > 0) {
        text.style.transform = "translateX(0px)";
        distanceMoved = 0;
        switchDirection();
        return;
      }

      text.style.transform = `translateX(${distanceMoved}px)`;
      setNewAnimationFrame();
    };

    const initialTimerId = setTimeout(() => {
      lastTime = undefined;
      requestAnimationFrame(update);
    }, delay);

    return () => {
      clearTimeout(initialTimerId);
      cancelAnimationFrame(animationFrameId);
      if (delayedTimerId) clearTimeout(delayedTimerId);
    };
  }, [speedPxSeconds, delay, children]);

  return (
    <div ref={ref} className="container">
      <div className="text">{children}</div>
      <style jsx>{`
        .container {
          position: relative;
          overflow: hidden;
        }
        .text {
          white-space: nowrap;
          width: 100%;
          display: flex;
        }
      `}</style>
    </div>
  );
}
