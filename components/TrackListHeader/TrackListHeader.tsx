import {
  Dispatch,
  MutableRefObject,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import { CardType } from "components/CardTrack";
import { Clock } from "components/icons";
import { useOnSmallScreen, useTranslations } from "hooks";

export default function TrackListHeader({
  isPin,
  setIsPin,
  type: cardType,
}: Readonly<{
  isPin: boolean;
  setIsPin: Dispatch<SetStateAction<boolean>>;
  type: CardType;
}>): ReactElement {
  const ref = useRef<HTMLDivElement>();
  const { translations } = useTranslations();
  const [type, setType] = useState<CardType>(cardType);

  const isSmallScreen = useOnSmallScreen((isSmall) => {
    if (isSmall) {
      setType(CardType.Presentation);
    } else {
      setType(cardType);
    }
  });

  useEffect(() => {
    const cachedRef = ref.current,
      observer = new IntersectionObserver(
        ([e]) => {
          if (e.intersectionRect.top >= 59) {
            setIsPin(true);
          } else {
            setIsPin(false);
          }
        },
        {
          rootMargin: `0px 0px -${(window.innerHeight || 0) - 60}px 0px`,
        }
      );

    observer.observe(cachedRef as Element);

    return function () {
      observer.unobserve(cachedRef as Element);
    };
  });

  return (
    <div
      className="trackListHeader"
      ref={ref as MutableRefObject<HTMLDivElement>}
    >
      <span>#</span>
      <span>{translations.playlistHeader.title}</span>
      {type === "playlist" ? (
        <>
          <span className="album">{translations.playlistHeader.album}</span>
          <span className="dataAdded">
            {translations.playlistHeader.dateAdded}
          </span>
        </>
      ) : null}
      <span className="emptynow"></span>
      <span className="clock">
        <Clock />
      </span>
      <style jsx>{`
        .trackListHeader {
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
            ? "[index] 48px [first] 14fr [var1] 8fr [var2] 3fr [popularity] 1fr [last] minmax(180px,2fr)"
            : type === "album"
              ? "[index] 48px [first] 14fr [popularity] 1fr [last] minmax(180px,2fr)"
              : "[index] 55px [first] 14fr [popularity] 1fr [last] minmax(180px,2fr)"};
        }
        .trackListHeader span {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          color: #ffffffb3;
          font-family: sans-serif;
        }
        .trackListHeader span:nth-of-type(1) {
          font-size: 16px;
          justify-self: center;
          margin-left: 16px;
        }
        .trackListHeader span:nth-of-type(2) {
          margin-left: ${isSmallScreen ? "0" : "70px"};
        }
        .clock {
          justify-content: center;
        }
        @media (max-width: 768px) {
          .trackListHeader {
            grid-template-columns: ${type === "playlist"
              ? "[index] 48px [first] 14fr [var1] 8fr [var2] 3fr [popularity] 1fr [last] minmax(60px,2fr)"
              : type === "album"
                ? "[index] 48px [first] 14fr [popularity] 1fr [last] minmax(60px,2fr)"
                : "[index] 55px [first] 14fr [popularity] 1fr [last] minmax(60px,2fr)"};
          }
        }
      `}</style>
    </div>
  );
}
