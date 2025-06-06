import {
  CSSProperties,
  KeyboardEvent,
  memo,
  ReactElement,
  useId,
  useRef,
  useState,
} from "react";

import { TrackActions } from "./TrackActions";
import { TrackDetails } from "./TrackDetails";
import { TrackImage } from "./TrackImage";
import {
  useAuth,
  useContextMenu,
  useOnScreen,
  useOnSmallScreen,
  useSpotify,
  useToast,
  useTranslations,
} from "hooks";
import { ITrack } from "types/spotify";
import {
  getIdFromUri,
  handlePlayCurrentTrackError,
  playCurrentTrack,
  templateReplace,
} from "utils";

export enum CardType {
  Presentation = "presentation",
  Playlist = "playlist",
  Album = "album",
}
interface ICardTrackProps {
  track: ITrack | undefined;
  playlistUri: string;
  style?: CSSProperties;
  isTrackInLibrary: boolean | undefined;
  type: CardType;
  isSingleTrack?: boolean;
  position?: number;
  onClickAdd?: () => void;
  uri?: string;
  visualPosition?: number;
  uris?: string[];
  index?: number;
}

function checkIfTrackIsPlayable(track?: ITrack, isPremium?: boolean) {
  return (
    track?.type === "episode" ||
    (!isPremium && track?.preview_url) ||
    (isPremium && track?.is_playable !== false && !track?.is_local)
  );
}
function checkTrackAsCurrentlyPlaying(
  track?: ITrack,
  currentlyPlaying?: ITrack
) {
  return (
    currentlyPlaying?.name === track?.name &&
    currentlyPlaying?.album?.name === track?.album?.name
  );
}

function CardTrack({
  track,
  playlistUri,
  isTrackInLibrary,
  style,
  type: cardType,
  isSingleTrack,
  position,
  onClickAdd,
  uri,
  visualPosition,
  uris,
  index,
}: Readonly<ICardTrackProps>): ReactElement | null {
  const {
    allTracks,
    deviceId,
    currentlyPlaying,
    player,
    isPlaying,
    setIsPlaying,
    setCurrentlyPlaying,
    pageDetails,
    setPlaylistPlayingId,
    setPlayedSource,
    setReconnectionError,
  } = useSpotify();
  const [mouseEnter, setMouseEnter] = useState(false);
  const [isFocusing, setIsFocusing] = useState(false);
  const [isLikedTrack, setIsLikedTrack] = useState(isTrackInLibrary);
  const [type, setType] = useState<CardType>(cardType);
  const trackRef = useRef<HTMLDivElement>(null);
  const { addContextMenu } = useContextMenu();
  const { addToast } = useToast();
  const { translations } = useTranslations();
  const isVisible = useOnScreen(trackRef, "-150px");
  const { isPremium } = useAuth();

  const isSmallScreen = useOnSmallScreen((isSmall) => {
    setType(isSmall ? CardType.Presentation : cardType);
  });

  const isPlayable = checkIfTrackIsPlayable(track, isPremium);
  const isTheSameAsCurrentlyPlaying = checkTrackAsCurrentlyPlaying(
    track,
    currentlyPlaying
  );

  const trackItemGridTemplateColumns: Record<CardType, string> = {
    [CardType.Playlist]:
      "[index] 48px [first] 14fr [var1] 8fr [var2] 3fr [popularity] 1fr [last] minmax(180px,1fr)",
    [CardType.Album]:
      "[index] 48px [first] 14fr [popularity] 1fr [last] minmax(180px,1fr)",
    [CardType.Presentation]:
      "[index] 55px [first] 14fr [popularity] 1fr [last] minmax(180px,1fr)",
  };
  const trackItemGridTemplateColumnsMobile: Record<CardType, string> = {
    [CardType.Playlist]:
      "[index] 48px [first] 14fr [var1] 8fr [var2] 3fr [popularity] 1fr [last] minmax(60px,1fr)",
    [CardType.Album]:
      "[index] 48px [first] 14fr [popularity] 1fr [last] minmax(60px,1fr)",
    [CardType.Presentation]:
      "[index] 55px [first] 14fr [popularity] 1fr [last] minmax(60px,1fr)",
  };

  async function playThisTrack() {
    try {
      await playCurrentTrack(
        {
          position: index ?? track?.track_number,
          preview_url: track?.preview_url,
          uri: track?.uri,
        },
        {
          allTracks,
          player,
          isPremium,
          deviceId,
          playlistUri,
          isSingleTrack,
          position,
          uri,
          uris,
        }
      );

      if (!isPremium) {
        setCurrentlyPlaying(track);
      }

      const source = pageDetails?.uri;
      const isCollection = source?.split(":")?.[3];
      setPlaylistPlayingId(
        isSingleTrack ? undefined : getIdFromUri(pageDetails?.uri, "id")
      );
      setPlayedSource(
        isCollection &&
          pageDetails?.type &&
          getIdFromUri(pageDetails?.uri, "id")
          ? `spotify:${pageDetails.type}:${getIdFromUri(
              pageDetails?.uri,
              "id"
            )}`
          : (source ?? track?.uri)
      );
    } catch (error) {
      handlePlayCurrentTrackError(error, {
        addToast,
        player: player as Spotify.Player,
        setReconnectionError,
        translations,
      });
    }
  }

  const id = useId();

  if (!track) return null;

  const keyActions: Record<string, (e: KeyboardEvent<HTMLDivElement>) => void> =
    {
      ArrowDown: (e) => {
        e.preventDefault();
        (e.currentTarget.nextElementSibling as HTMLElement)?.focus();
      },
      ArrowUp: (e) => {
        e.preventDefault();
        const prev = e.currentTarget.previousElementSibling as HTMLElement;
        const target = prev ?? e.currentTarget;

        const scrollElement = document.querySelector<HTMLElement>(
          "#right .simplebar-content-wrapper"
        );

        if (!scrollElement) {
          target.focus();
          return;
        }

        function forceItemToY(
          el: HTMLElement,
          scrollElement: HTMLElement,
          offset = 100
        ) {
          const elRect = el.getBoundingClientRect();
          const containerRect = scrollElement.getBoundingClientRect();

          const elTopRelative = elRect.top - containerRect.top;

          if (elTopRelative < offset) {
            const scrollAmount = elTopRelative - offset;

            scrollElement.scrollBy({
              top: scrollAmount,
              behavior: "instant",
            });
          }
        }

        forceItemToY(target, scrollElement, 100);
        target.focus();
      },
      " ": (e) => {
        if (!isPremium) {
          e.preventDefault();
          player?.togglePlay();
        }
      },
      Enter: (e) => {
        if (track?.corruptedTrack) {
          addToast({
            variant: "error",
            message: templateReplace(
              translations.toastMessages.isCorruptedAndCannotBePlayed,
              [translations.contentType.track]
            ),
          });
          return;
        }
        e.preventDefault();
        if (isPlaying && isTheSameAsCurrentlyPlaying) {
          player?.pause();
          setIsPlaying(false);
          setPlaylistPlayingId(getIdFromUri(pageDetails?.uri, "id"));
        } else if (isPlayable) {
          if (isPremium) {
            (player as Spotify.Player)?.activateElement();
          }
          playThisTrack();
        } else {
          addToast({
            variant: "info",
            message: translations.toastMessages.contentIsUnavailable,
          });
        }
      },
    };

  return (
    <div
      key={`${track.id ?? ""}-${id}`}
      style={style}
      className="trackItem"
      onClick={() => {
        if (!isSmallScreen) return;
        if (isPlayable) {
          if (track.corruptedTrack) {
            addToast({
              variant: "error",
              message: templateReplace(
                translations.toastMessages.isCorruptedAndCannotBePlayed,
                [translations.contentType.track]
              ),
            });
            return;
          }
          if (isPremium) {
            (player as Spotify.Player)?.activateElement();
          }
          playThisTrack();
        } else {
          addToast({
            variant: "info",
            message: translations.toastMessages.contentIsUnavailable,
          });
        }
      }}
      onDoubleClick={() => {
        if (isPlayable) {
          if (track.corruptedTrack) {
            addToast({
              variant: "error",
              message: templateReplace(
                translations.toastMessages.isCorruptedAndCannotBePlayed,
                [translations.contentType.track]
              ),
            });
            return;
          }
          if (isPremium) {
            (player as Spotify.Player)?.activateElement();
          }
          playThisTrack();
        } else {
          addToast({
            variant: "info",
            message: translations.toastMessages.contentIsUnavailable,
          });
        }
      }}
      role="row"
      data-testid="cardTrack-container"
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      onContextMenu={(e) => {
        e.preventDefault();
        const x = e.pageX;
        const y = e.pageY;
        addContextMenu({
          type: "cardTrack",
          data: track,
          position: { x, y },
        });
      }}
      onMouseEnter={() => setMouseEnter(true)}
      onFocus={() => setIsFocusing(true)}
      onBlur={() => setIsFocusing(false)}
      onMouseLeave={() => setMouseEnter(false)}
      ref={trackRef}
      onKeyDown={(e) => {
        const action = keyActions[e.key];
        if (action) action(e);
      }}
    >
      <TrackImage
        isFocusing={isFocusing}
        isSmallScreen={isSmallScreen}
        mouseEnter={mouseEnter}
        playThisTrack={playThisTrack}
        track={track}
        visualPosition={visualPosition}
        position={position}
        type={type}
      />
      <TrackDetails track={track} isSmallScreen={isSmallScreen} type={type} />
      <TrackActions
        mouseEnter={mouseEnter}
        isFocusing={isFocusing}
        setIsLikedTrack={setIsLikedTrack}
        isTrackInLibrary={isTrackInLibrary}
        track={track}
        onClickAdd={onClickAdd}
      />
      <style jsx>{`
        .trackItem :global(.trackHeart) {
          opacity: ${isLikedTrack || isFocusing || mouseEnter ? "1" : "0"};
        }
        .trackItem {
          opacity: ${isPlayable ? 1 : 0.4};
        }
        .trackItem {
          background-color: ${isTheSameAsCurrentlyPlaying
            ? "#2020204d"
            : "transparent"};
          grid-template-columns: ${trackItemGridTemplateColumns[type]};
        }
        .trackItem :global(.trackName) {
          color: ${isTheSameAsCurrentlyPlaying ? "#1db954" : "#fff"};
        }
        @media (max-width: 768px) {
          .trackItem {
            background-color: ${isTheSameAsCurrentlyPlaying
              ? "#2020204d"
              : "transparent"};
            grid-template-columns: ${trackItemGridTemplateColumnsMobile[type]};
          }
        }
        .trackItem :global(.trackArtists a) {
          color: ${mouseEnter || isFocusing ? "#fff" : "inherit"};
        }
        .trackItem :global(section):nth-of-type(2) {
          justify-content: ${type === "playlist" ? "flex-start" : "flex-end"};
          margin: ${type === "album" ? "16px" : "0"};
        }
      `}</style>
      <style jsx>{`
        :global(.trackHeart:focus),
        :global(.trackHeart:hover) {
          transform: scale(1.06);
        }
        .trackItem:focus {
          scroll-margin-block-start: 100px;
          scroll-margin-block-end: 4px;
        }
        .trackItem :global(p),
        .trackItem :global(.trackName),
        .trackItem :global(.trackArtists) {
          margin: 0px;
          overflow: hidden;
          text-align: left;
          text-overflow: ellipsis;
          white-space: unset;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          -webkit-line-clamp: 1;
        }
        .trackItem :global(.trackArtists),
        .trackItem :global(span) {
          margin: 0;
          font-family: "Lato", "sans-serif";
          font-weight: 400;
          color: #ffffffb3;
          font-size: 13px;
        }
        .trackItem :global(.trackArtists a):hover {
          text-decoration: underline;
        }
        .trackItem :global(section) {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          max-width: 100%;
        }
        .trackItem :global(section):nth-of-type(4) {
          justify-content: flex-end;
        }
        .trackItem {
          width: 100%;
          height: 65px;
          margin: 0;
          padding: 0;
          border-radius: 2px;
          align-items: center;
          text-decoration: none;
          color: inherit;
          cursor: default;
          user-select: none;
          display: grid;
          grid-gap: 16px;
        }
        .trackItem:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .trackItem:active,
        .trackItem:focus-within {
          background-color: #ffffff4d;
        }
      `}</style>
    </div>
  );
}

export default memo(CardTrack, (prevProps, nextProps) => {
  return (
    prevProps.track?.id === nextProps.track?.id &&
    prevProps.playlistUri === nextProps.playlistUri &&
    prevProps.isTrackInLibrary === nextProps.isTrackInLibrary &&
    prevProps.isSingleTrack === nextProps.isSingleTrack &&
    prevProps.type === nextProps.type &&
    prevProps.position === nextProps.position
  );
});
