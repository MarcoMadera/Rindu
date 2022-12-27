import { PropsWithChildren, ReactElement, useEffect, useRef } from "react";

interface IScrollableText {
  speed?: number;
  delay?: number;
}

export default function ScrollableText({
  children,
  speed = 20,
  delay = 2000,
}: PropsWithChildren<IScrollableText>): ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let direction = -1;
    if (!ref.current) return;

    const container = ref.current;
    const text = container.firstElementChild as HTMLElement;

    let lastTime: number | undefined;
    let animationFrameId: number;
    let distance = 0;
    text.style.transform = "translateX(0px)";

    if (text.scrollWidth <= container.offsetWidth) return;

    const update = (timestamp: number) => {
      const elapsedTime = lastTime ? timestamp - lastTime : 0;
      distance += (direction * speed * elapsedTime) / 1000;
      lastTime = timestamp;
      const textWidth = text.scrollWidth - text.offsetWidth;

      if (distance < -textWidth) {
        distance = -textWidth;
        direction = 1;
        setTimeout(() => {
          lastTime = undefined;
          animationFrameId = requestAnimationFrame(update);
        }, delay);
      } else if (distance > 0) {
        text.style.transform = "translateX(0px)";
        distance = 0;
        direction = -1;
        setTimeout(() => {
          lastTime = undefined;
          animationFrameId = requestAnimationFrame(update);
        }, delay);
      } else {
        text.style.transform = `translateX(${distance}px)`;
        animationFrameId = requestAnimationFrame(update);
      }
    };

    const timer = setTimeout(() => {
      lastTime = undefined;
      requestAnimationFrame(update);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, delay, children]);

  return (
    <div ref={ref} className="container">
      <div className="text">{children}</div>
      <style jsx>{`
        .container {
          position: relative;
          overflow: hidden;
          width: 100%;
          mask-image: linear-gradient(
            90deg,
            transparent 0,
            #000 2px,
            #000 calc(100% - 12px),
            transparent
          );
          margin: 0 -4px;
        }

        .text {
          white-space: nowrap;
          width: 100%;
          display: flex;
          transform: translateX(var(--trans-x));
          padding: 0 4px;
        }
      `}</style>
    </div>
  );
}
