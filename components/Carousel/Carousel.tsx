import {
  Children,
  cloneElement,
  HTMLAttributes,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { Heading } from "components";
import { Chevron } from "components/icons";
import { useOnSmallScreen } from "hooks";

interface CarouselProps {
  title?: string;
  gap: number;
}

export default function Carousel({
  title,
  gap = 24,
  children,
}: PropsWithChildren<CarouselProps>): ReactElement | null {
  const [timesMoveCarousel, setTimesMoveCarousel] = useState(0);
  const totalItems = Children.count(children);
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLElement>(null);
  const [maxMoves, setMaxMoves] = useState(0);
  const isSmallScreen = useOnSmallScreen();
  const id = useId();

  useEffect(() => {
    function updateSize() {
      if (!carouselRef.current || !containerRef.current) return;
      const carousel = carouselRef.current;
      const itemWidth = carousel.children[0].clientWidth + gap;
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const itemsInMainContainer = Math.floor(containerWidth / itemWidth);
      const maximumMoves =
        Math.ceil(totalItems / (itemsInMainContainer || 1)) - 1;
      const shouldMove =
        timesMoveCarousel >= 0 && timesMoveCarousel <= maximumMoves;
      const spaceToMove = timesMoveCarousel * itemsInMainContainer * itemWidth;
      setMaxMoves(maximumMoves);

      if (timesMoveCarousel > maximumMoves) {
        setTimesMoveCarousel(maximumMoves);
      }
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
        <Heading id={`title-${id}`} number={2}>
          {title}
        </Heading>
        <div className="button-container">
          {maxMoves > 0 && !isSmallScreen ? (
            <>
              <button
                type="button"
                aria-label="Previous"
                disabled={timesMoveCarousel <= 0}
                onClick={() => {
                  if (timesMoveCarousel <= 0) return;
                  setTimesMoveCarousel((prev) => prev - 1);
                }}
              >
                <Chevron rotation={"0deg"} />
              </button>
              <button
                type="button"
                aria-label="Next"
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
      <section
        ref={carouselRef}
        className="carousel-content"
        aria-describedby={`title-${id}`}
      >
        {Children.map(children, (child, number) => {
          if (isValidElement(child) && carouselRef.current) {
            const itemWidth = carouselRef.current.children[0].clientWidth + gap;
            const containerWidth = containerRef.current?.offsetWidth ?? 0;
            const itemsInMainContainer = Math.floor(containerWidth / itemWidth);
            const minRange = itemsInMainContainer * timesMoveCarousel;
            const maxRange = itemsInMainContainer * (timesMoveCarousel + 1);
            const shouldFocus = number < maxRange && number >= minRange;
            return cloneElement(child, {
              ...child.props,
              tabIndex: shouldFocus ? undefined : -1,
              "aria-hidden": shouldFocus ? "false" : "true",
              style: { "scroll-snap-align": "start" },
            } as Partial<unknown> & HTMLAttributes<HTMLElement>);
          }
          return child;
        })}
      </section>
      <style jsx>{`
        .carousel-container {
          margin: 10px 0 30px;
        }
        section.carousel-content > :global(*) {
          width: min-content;
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
          transition: 400ms ease-in;
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

        @media (max-width: 768px) {
          section {
            overflow-x: scroll;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            width: 100%;
            grid-gap: 0;
            margin: 20px 0;
          }
          section::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
