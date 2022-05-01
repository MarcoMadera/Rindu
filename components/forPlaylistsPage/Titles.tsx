import Clock from "components/icons/Clock";
import {
  Dispatch,
  MutableRefObject,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
} from "react";

export default function Titles({
  isPin,
  setIsPin,
  type,
}: {
  isPin: boolean;
  setIsPin: Dispatch<SetStateAction<boolean>>;
  type: "presentation" | "playlist" | "album";
}): ReactElement {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const cachedRef = ref.current,
      observer = new IntersectionObserver(
        ([e]) => {
          if (e.intersectionRect.top >= 60) {
            setIsPin(true);
          } else {
            setIsPin(false);
          }
        },
        {
          rootMargin: `0px 0px -${window.innerHeight - 60}px 0px`,
        }
      );

    observer.observe(cachedRef as Element);

    return function () {
      observer.unobserve(cachedRef as Element);
    };
  });

  return (
    <div
      id="titlesObserver"
      className="titles"
      ref={ref as MutableRefObject<HTMLDivElement>}
    >
      <span>#</span>
      <span>TITLE</span>
      {type === "playlist" ? (
        <>
          <span className="album">ALBUM</span>
          <span className="dataAdded">DATE ADDED</span>
        </>
      ) : null}
      <span className="clock">
        <Clock />
      </span>
      <style jsx>{`
        .titles {
          border-bottom: 1px solid transparent;
          box-sizing: content-box;
          height: 36px;
          margin: ${isPin ? "0 -32px 8px" : "0 -16px 8px"};
          padding: ${isPin ? "0 32px" : "0 16px"};
          position: sticky;
          top: 60px;
          z-index: 2;
          display: grid;
          grid-gap: 16px;
          background-color: ${isPin ? "#181818" : "transparent"};
          border-bottom: 1px solid #ffffff1a;
          grid-template-columns: ${type === "playlist"
            ? "[index] 48px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(160px,1fr)"
            : type === "album"
            ? "[index] 48px [first] 6fr [last] minmax(160px,1fr)"
            : "[index] 55px [first] 4fr [last] minmax(160px,1fr)"};
        }
        .titles span {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          color: #b3b3b3;
          font-family: sans-serif;
        }
        .titles span:nth-of-type(1) {
          font-size: 16px;
          justify-self: center;
          margin-left: 16px;
        }
        .titles span:nth-of-type(2) {
          margin-left: 70px;
        }
        .clock {
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
