import {
  Children,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Chevron } from "./icons/Chevron";

export default function Carousel({
  title,
  gap = 24,
  children,
}: {
  title?: string;
  gap: number;
  children: ReactNode;
}): ReactElement | null {
  const [timesMoveCarousel, setTimesMoveCarousel] = useState(0);
  const totalItems = Children.count(children);
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLElement>(null);
  const [maxMoves, setMaxMoves] = useState(0);

  useEffect(() => {
    function updateSize() {
      if (!carouselRef.current || !containerRef.current) return;
      const carousel = carouselRef.current;
      const itemWidth = carousel.children[0].clientWidth + gap;
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const itemsInMainContainer = Math.floor(containerWidth / itemWidth);
      const maximumMoves = Math.ceil(totalItems / itemsInMainContainer) - 1;
      const shouldMove =
        timesMoveCarousel >= 0 && timesMoveCarousel <= maximumMoves;
      const spaceToMove = timesMoveCarousel * itemsInMainContainer * itemWidth;
      setMaxMoves(maximumMoves);

      if (timesMoveCarousel > maximumMoves) {
        setTimesMoveCarousel(maximumMoves);
      }
      if (!carousel) return;
      carousel.style.transform = `translateX(-${spaceToMove}px)`;
      if (shouldMove) {
        carouselRef.current.style.transform = `translateX(-${spaceToMove}px)`;
      }
    }

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [gap, timesMoveCarousel, totalItems]);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="carousel-container" ref={containerRef}>
      <div className="header">
        <h2>{title}</h2>
        <div className="button-container">
          {maxMoves > 0 ? (
            <>
              <button
                disabled={timesMoveCarousel <= 0}
                onClick={() => {
                  if (timesMoveCarousel <= 0) return;
                  setTimesMoveCarousel((prev) => prev - 1);
                }}
              >
                <Chevron rotation={"0deg"} />
              </button>
              <button
                disabled={timesMoveCarousel >= maxMoves}
                onClick={() => {
                  if (timesMoveCarousel >= maxMoves) return;
                  setTimesMoveCarousel((prev) => prev + 1);
                }}
              >
                <Chevron rotation={"180deg"} />
              </button>
            </>
          ) : null}
        </div>
      </div>
      <section ref={carouselRef} className="carousel-content">
        {children}
      </section>
      <style jsx>{`
        .carousel-container {
          margin: 10px 0 30px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        section {
          display: flex;
          grid-gap: ${gap}px;
          margin: 20px 0 50px 0;
          transform 400ms ease-in;
        }
        h2 {
          color: #fff;
          display: inline-block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 45px;
          text-transform: none;
          margin: 0;
          z-index: 1;
          position: relative;
        }
        .button-container {
          display: flex;
          gap: 16px;
        }
        button {
          display: flex;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.7);
          border: none;
          border-radius: 50%;
          color: #fff;
          height: 32px;
          justify-content: center;
          position: relative;
          width: 32px;
          cursor: pointer;
        }
        button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
