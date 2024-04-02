import {
  Dispatch,
  MutableRefObject,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import { Search } from "components/icons";
import { useSpotify, useTranslations } from "hooks";
import { isCorruptedTrack } from "utils";
import { search } from "utils/spotifyCalls";

interface InputElementProps {
  setData: Dispatch<SetStateAction<SpotifyApi.SearchResponse | null>>;
  source: "search" | "playlist";
}

export default function SearchInputElement({
  setData,
  source,
}: InputElementProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>();
  const [isTyping, setIsTyping] = useState(false);
  const [query, setQuery] = useState("");
  const [shouldSearch, setShouldSearch] = useState(false);
  const { setAllTracks, setIgnoreShortcuts } = useSpotify();
  const isFromSearch = source === "search";
  const { translations } = useTranslations();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isTyping && query) {
      timer = setTimeout(() => {
        if (!isTyping && query) {
          setShouldSearch(true);
        }
      }, 1500);
    }

    if (!query) {
      setData(null);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [query, isTyping, setData]);

  useEffect(() => {
    async function searchQuery() {
      const searchData = await search(query);
      setData(searchData);
      if (searchData?.tracks?.items.length && source === "search") {
        setAllTracks(() => {
          if (!searchData?.tracks) return [];
          return searchData.tracks?.items?.map((track) => {
            return {
              ...track,
              audio: track.preview_url,
              corruptedTrack: isCorruptedTrack(track),
            };
          });
        });
      }
      setShouldSearch(false);
    }
    if (shouldSearch && query) {
      searchQuery();
    }
  }, [query, shouldSearch, setData, setAllTracks, source]);

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <input
          ref={inputRef as MutableRefObject<HTMLInputElement>}
          maxLength={80}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder={translations.pages.playlist.searchPlaceholder}
          defaultValue=""
          onChange={(e) => {
            setQuery(e.target.value);
            setIsTyping(true);
          }}
          onFocus={() => {
            setIgnoreShortcuts.on();
          }}
          onBlur={() => {
            setIgnoreShortcuts.off();
          }}
          onKeyDown={(e) => {
            if (e.key === " ") {
              e.stopPropagation();
            }
          }}
          onKeyUp={() => {
            setIsTyping(false);
          }}
        />
      </form>
      <Search
        width={isFromSearch ? "24px" : "16px"}
        height={isFromSearch ? "24px" : "16px"}
        fill={isFromSearch ? "#121212" : "#ffffffb3"}
      />
      <style jsx>{`
        div {
          max-width: 364px;
          position: relative;
        }
        div :global(svg) {
          position: absolute;
          display: flex;
          align-items: center;
          left: 12px;
          pointer-events: none;
          height: 100%;
          right: 12px;
          top: 0;
          bottom: 0;
          border: 0;
          margin: 0;
          padding: 0;
          vertical-align: baseline;
        }
        form {
          border: 0;
          margin: 0;
          padding: 0;
          vertical-align: baseline;
        }
        input {
          border: 0;
          border-radius: ${isFromSearch ? "500px" : "4px"};
          background-color: ${isFromSearch ? "#fff" : "#ffffff1a"};
          color: ${isFromSearch ? "#000" : "#ffffffb3"};
          height: 40px;
          padding: ${isFromSearch ? "6px 48px" : "4px 36px"};
          text-overflow: ellipsis;
          width: 100%;
          font-size: 0.875rem;
          font-weight: 400;
          letter-spacing: normal;
          line-height: 16px;
          text-transform: none;
        }
        input:focus {
          outline: none;
        }

        @media (max-width: 768px) {
          div {
            max-width: 430px;
            width: 100%;
            margin: 0 8px;
          }
        }
      `}</style>
    </div>
  );
}
