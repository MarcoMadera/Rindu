import useHeader from "hooks/useHeader";
import useSpotify from "hooks/useSpotify";
import useToggle from "hooks/useToggle";
import {
  MutableRefObject,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { getRandomColor } from "utils/colors";
import formaLyrics from "utils/formatLyrics";
import { getLyrics } from "utils/getLyrics";
import { hexToHsl } from "utils/hexToHsl";
import { within } from "utils/whitin";
import { LoadingSpinner } from "./LoadingSpinner";

interface FullScreenLyricsProps {
  appRef?: MutableRefObject<HTMLDivElement | undefined>;
}

export default function FullScreenLyrics({
  appRef,
}: FullScreenLyricsProps): ReactElement {
  const { currrentlyPlaying } = useSpotify();
  const { headerColor, setHeaderColor } = useHeader({
    disableOpacityChange: true,
    alwaysDisplayColor: false,
    showOnFixed: false,
    disableBackground: true,
  });
  const [lyrics, setLyrics] = useState<string[] | null | undefined>(undefined);
  const [error, setError] = useToggle();
  const [loading, setLoading] = useToggle();
  const backgroundColor = useRef<string>(getRandomColor());
  const [lyricLineColor, setLyricLineColor] = useState<string>("#fff");

  useEffect(() => {
    const hslBackgroundColor = hexToHsl(backgroundColor.current, true);
    const lightness = hslBackgroundColor?.[2];
    const newLightness = lightness && lightness - 20;
    const newHslBackgroundColor = `hsl(${hslBackgroundColor?.[0] ?? 0}, ${
      hslBackgroundColor?.[1] ?? 0
    }%, ${newLightness ?? 0}%)`;
    setLyricLineColor(newHslBackgroundColor);
  }, [lyrics]);

  useEffect(() => {
    const app = appRef?.current;
    if (currrentlyPlaying?.type !== "track" || !app) return setError.on();
    const originalBackgroundColor: string = app.style.backgroundColor;
    const originalHeaderColor: string = headerColor;
    const artist = currrentlyPlaying?.artists?.[0]?.name;
    const title = currrentlyPlaying?.name;
    app.style.backgroundColor = backgroundColor.current;
    setHeaderColor(backgroundColor.current);

    if (artist && title && !loading) {
      setLoading.on();
      within(getLyrics(artist, title), 40000)
        .then((res) => {
          if (res) return setLyrics(formaLyrics(res));
          setError.on();
        })
        .finally(() => setLoading.off());
    } else {
      setError.on();
    }

    return () => {
      setLyrics(undefined);
      app.style.backgroundColor = originalBackgroundColor;
      setHeaderColor(originalHeaderColor);
      setError.reset();
      setLoading.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currrentlyPlaying?.uri]);

  return (
    <div className="lyrics-container">
      {!lyrics ? (
        <div className="message-container">
          {loading && <LoadingSpinner />}
          {error && !loading && (
            <div className="lyrics-error">
              <p>Could not find lyrics</p>
            </div>
          )}
        </div>
      ) : null}
      {lyrics && (
        <div className="lyrics">
          {lyrics.map((line, i) => {
            return (
              <div key={i} className="line">
                {line}
              </div>
            );
          })}
        </div>
      )}
      <style jsx>{`
        .lyrics-container {
          width: 100%;
          display: flex;
          min-width: calc(100% - 128px);

          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 42px;
          margin: 0px 144px;
          max-width: max-content;
        }
        @media (max-width: 768px) {
          .lyrics-container {
            margin: 0px 64px;
            font-size: 24px;
          }
        }
        @media (max-width: 658px) {
          .lyrics-container {
            margin: 0px;
            font-size: 18px;
          }
        }
        .message-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
        }
        .line {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 54px;
          cursor: pointer;
          transition: all 0.1s ease-out 0s;
          color: ${lyricLineColor};
        }
        .lyrics .line:hover {
          color: white;
        }
        .lyrics {
          font-size: 2rem;
          color: white;
          padding: 1rem;
        }
        .lyrics-error {
          font-size: 2rem;
          color: white;
          text-align: center;
          padding: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
