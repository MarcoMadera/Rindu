import {
  CSSProperties,
  memo,
  MutableRefObject,
  ReactElement,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { ArtistList, ExplicitSign } from "components";
import { Heart, Pause, Play, Playing, ThreeDots } from "components/icons";
import {
  useAuth,
  useContextMenu,
  useOnScreen,
  useOnSmallScreen,
  useSpotify,
  useToast,
} from "hooks";
import { ITrack } from "types/spotify";
import {
  formatTime,
  getSiteUrl,
  getTimeAgo,
  playCurrentTrack,
  spanishCountries,
} from "utils";
import {
  removeEpisodesFromLibrary,
  removeTracksFromLibrary,
  saveEpisodesToLibrary,
  saveTracksToLibrary,
} from "utils/spotifyCalls";

export enum CardType {
  presentation = "presentation",
  playlist = "playlist",
  album = "album",
}
interface CardTrackProps {
  track: ITrack | undefined;
  accessToken: string | undefined;
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
}

function CardTrack({
  accessToken,
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
}: CardTrackProps): ReactElement | null {
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
  const trackRef = useRef<HTMLDivElement>(null);
  const { user, setAccessToken } = useAuth();
  const { addContextMenu } = useContextMenu();
  const { addToast } = useToast();
  const isPremium = user?.product === "premium";
  const isVisible = useOnScreen(trackRef);
  const router = useRouter();
  const country = router.query.country as string;
  const locale = spanishCountries.includes(country) ? "es" : "en";
  const date = track?.added_at ? +new Date(track?.added_at) : NaN;
  const displayDate = isNaN(date) ? track?.added_at : getTimeAgo(date, locale);
  const [type, setType] = useState<CardType>(cardType);

  const isSmallScreen = useOnSmallScreen((isSmall) => {
    if (isSmall) {
      setType(CardType.presentation);
    } else {
      setType(cardType);
    }
  });

  const isPlayable =
    track?.type === "episode" ||
    (!isPremium && track?.preview_url) ||
    (isPremium && track?.is_playable !== false && !track?.is_local);

  const isTheSameAsCurrentlyPlaying =
    currentlyPlaying?.name === track?.name &&
    currentlyPlaying?.album?.name === track?.album?.name;

  function playThisTrack() {
    playCurrentTrack(track, {
      allTracks,
      player,
      user,
      accessToken,
      deviceId,
      playlistUri,
      playlistId: pageDetails?.id,
      setCurrentlyPlaying,
      setPlaylistPlayingId,
      isSingleTrack,
      position,
      setAccessToken,
      uri,
      uris,
    }).then((status) => {
      if (status === 404) {
        (player as Spotify.Player).disconnect();
        addToast({
          variant: "error",
          message: "Unable to play, trying to reconnect, please wait...",
        });
        setReconnectionError(true);
      }
      if (status === 200) {
        const source = pageDetails?.uri;
        const isCollection = source?.split(":")?.[3];
        setPlayedSource(
          isCollection && pageDetails?.type && pageDetails?.id
            ? `spotify:${pageDetails.type}:${pageDetails.id}`
            : source ?? track?.uri
        );
      }
      if (status === 400) {
        addToast({
          variant: "error",
          message: "Error playing this track",
        });
      }
    });
  }

  if (!track) return null;

  return (
    <div
      style={style}
      className="trackItem"
      onClick={() => {
        if (!isSmallScreen) return;
        if (isPlayable) {
          if (track.corruptedTrack) {
            addToast({
              variant: "error",
              message: "This track is corrupted and cannot be played",
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
            message: "This content is not available",
          });
        }
      }}
      onDoubleClick={() => {
        if (isPlayable) {
          if (track.corruptedTrack) {
            addToast({
              variant: "error",
              message: "This track is corrupted and cannot be played",
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
            message: "This content is not available",
          });
        }
      }}
      role="button"
      data-testid="cardTrack-container"
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={isVisible ? "false" : "true"}
      onMouseEnter={() => {
        setMouseEnter(true);
      }}
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
      onFocus={() => {
        setIsFocusing(true);
      }}
      onBlur={() => {
        setIsFocusing(false);
      }}
      onMouseLeave={() => setMouseEnter(false)}
      ref={trackRef as MutableRefObject<HTMLDivElement>}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          (e.currentTarget.nextElementSibling as HTMLElement)?.focus();
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          (e.currentTarget.previousElementSibling as HTMLElement)?.focus();
        }
        if (e.key === " ") {
          e.preventDefault();
          if (!isPremium) {
            player?.togglePlay();
          }
        }
        if (e.key === "Enter") {
          if (track.corruptedTrack) {
            addToast({
              variant: "error",
              message: "This track is corrupted and cannot be played",
            });
            return;
          }
          e.preventDefault();
          if (isPlaying && isTheSameAsCurrentlyPlaying) {
            player?.pause();
            setIsPlaying(false);
            setPlaylistPlayingId(pageDetails?.id);
          } else {
            if (isPlayable) {
              if (isPremium) {
                (player as Spotify.Player)?.activateElement();
              }
              playThisTrack();
            } else {
              addToast({
                variant: "info",
                message: "This content is not available",
              });
            }
          }
        }
      }}
    >
      <button
        type="button"
        className="playButton"
        aria-label={isPlaying && isTheSameAsCurrentlyPlaying ? "Pause" : "Play"}
        onClick={() => {
          if (isSmallScreen) return;
          if (isTheSameAsCurrentlyPlaying && isPlayable) {
            player?.togglePlay();
            setIsPlaying(!isPlaying);
            return;
          }
          if (isPlayable) {
            if (track.corruptedTrack) {
              addToast({
                variant: "error",
                message: "This track is corrupted and cannot be played",
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
              message: "This content is not available",
            });
          }
        }}
        tabIndex={isVisible ? 0 : -1}
        aria-hidden={isVisible ? "false" : "true"}
      >
        {mouseEnter && isTheSameAsCurrentlyPlaying && isPlaying ? (
          <Pause fill="#fff" />
        ) : isTheSameAsCurrentlyPlaying && isPlaying ? (
          <Playing />
        ) : (mouseEnter || isFocusing) && isPlayable ? (
          <Play fill="#fff" />
        ) : (
          <span className="position">{`${
            visualPosition ?? (typeof position === "number" ? position + 1 : "")
          }`}</span>
        )}
      </button>
      <section>
        {type !== "presentation" ? (
          track.album?.images?.length ? (
            //  eslint-disable-next-line @next/next/no-img-element
            <img
              loading="lazy"
              src={track.album?.images[2]?.url ?? track.album?.images[1]?.url}
              alt=""
              className="img"
              width="48"
              height="48"
            />
          ) : (
            <div className="img"></div>
          )
        ) : null}
        <div className="trackArtistsContainer">
          {track.id && track.name ? (
            <Link
              href={`/${track.type ?? "track"}/${track.id}`}
              className="trackName"
            >
              {track.name}
            </Link>
          ) : null}
          <span className="trackArtists">
            {track.explicit && <ExplicitSign />}
            <ArtistList artists={track.artists} />
          </span>
        </div>
      </section>
      {type === "playlist" && track.album && track.album.id ? (
        <>
          <section>
            <p className="trackArtists">
              <Link
                href={`/${track.album.type ?? "album"}/${track.album.id}`} // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={isVisible ? 0 : -1}
                aria-hidden={isVisible ? "false" : "true"}
              >
                {track.album.name}
              </Link>
            </p>
          </section>
          <section>
            <p className="trackArtists">{displayDate}</p>
          </section>
        </>
      ) : null}
      <section>
        {track.popularity && !isSmallScreen ? (
          <div className="pop-meter">
            <div className="pop-meter-bar"></div>
            <div
              className="pop-meter-overlay"
              style={{
                width: track.popularity ? `${track.popularity}%` : undefined,
              }}
            ></div>
          </div>
        ) : null}
      </section>
      <section className="extras">
        <Heart
          className="trackHeart"
          active={!!isTrackInLibrary}
          tabIndex={isVisible ? 0 : -1}
          aria-hidden={isVisible ? "false" : "true"}
          handleLike={async () => {
            const saveToLibrary =
              track.type === "episode"
                ? saveEpisodesToLibrary
                : saveTracksToLibrary;
            const saveRes = await saveToLibrary([track.id ?? ""], accessToken);
            if (saveRes) {
              setIsLikedTrack(true);
              addToast({
                variant: "success",
                message: `${
                  track.type === "episode" ? "Episode" : "Song"
                } added to library`,
              });
              return true;
            }
            return null;
          }}
          handleDislike={async () => {
            const removeFromLibrary =
              track.type === "episode"
                ? removeEpisodesFromLibrary
                : removeTracksFromLibrary;
            const removeRes = await removeFromLibrary(
              [track.id ?? ""],
              accessToken
            );
            if (removeRes) {
              setIsLikedTrack(false);
              addToast({
                variant: "success",
                message: `${
                  track.type === "episode" ? "Episode" : "Song"
                } removed from library.`,
              });
              return true;
            }
            return null;
          }}
        />
        <p className="trackArtists time">
          {track.duration_ms ? formatTime(track.duration_ms / 1000) : ""}
        </p>
        {onClickAdd && (
          <button
            type="button"
            className="add"
            onClick={onClickAdd}
            tabIndex={isVisible ? 0 : -1}
            aria-hidden={isVisible ? "false" : "true"}
          >
            Add
          </button>
        )}
        <button
          type="button"
          className="options"
          aria-label="Show more options"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            const x = e.pageX;
            const y = e.pageY;
            addContextMenu({
              type: "cardTrack",
              data: track,
              position: { x, y },
            });
          }}
          tabIndex={isVisible ? 0 : -1}
          aria-hidden={isVisible ? "false" : "true"}
        >
          {mouseEnter || isFocusing ? (
            <ThreeDots />
          ) : (
            <div className="threeDots"></div>
          )}
        </button>
      </section>
      <style jsx>{`
        .playButton {
          background-image: ${type === "presentation"
            ? `url(${
                track.album?.images?.[2]?.url ??
                track.album?.images?.[1]?.url ??
                `${getSiteUrl()}/defaultSongCover.jpeg`
              })`
            : "unset"};
        }
        .trackItem :global(.trackHeart) {
          opacity: ${isLikedTrack || isFocusing || mouseEnter ? "1" : "0"};
        }
        .trackArtists :global(a) {
          color: ${mouseEnter || isFocusing ? "#fff" : "inherit"};
        }
        .trackItem {
          opacity: ${isPlayable ? 1 : 0.4};
        }
        button {
          width: ${type !== "presentation" ? "32" : "40"}px;
          height: ${type !== "presentation" ? "32" : "40"}px;
        }
        .trackItem :global(a.trackName) {
          color: ${isTheSameAsCurrentlyPlaying ? "#1db954" : "#fff"};
        }
        section:nth-of-type(2) {
          justify-content: ${type === "playlist" ? "flex-start" : "flex-end"};
          margin: ${type === "album" ? "16px" : "0"};
        }
        .trackItem {
          background-color: ${isTheSameAsCurrentlyPlaying
            ? "#2020204d"
            : "transparent"};
          grid-template-columns: ${type === "playlist"
            ? "[index] 48px [first] 14fr [var1] 8fr [var2] 3fr [popularity] 1fr [last] minmax(180px,1fr)"
            : type === "album"
            ? "[index] 48px [first] 14fr [popularity] 1fr [last] minmax(180px,1fr)"
            : "[index] 55px [first] 14fr [popularity] 1fr [last] minmax(180px,1fr)"};
        }
        @media (max-width: 768px) {
          .trackItem {
            background-color: ${isTheSameAsCurrentlyPlaying
              ? "#2020204d"
              : "transparent"};
            grid-template-columns: ${type === "playlist"
              ? "[index] 48px [first] 14fr [var1] 8fr [var2] 3fr [popularity] 1fr [last] minmax(60px,1fr)"
              : type === "album"
              ? "[index] 48px [first] 14fr [popularity] 1fr [last] minmax(60px,1fr)"
              : "[index] 55px [first] 14fr [popularity] 1fr [last] minmax(60px,1fr)"};
          }
        }
      `}</style>
      <style jsx>{`
        :global(.trackHeart:focus),
        :global(.trackHeart:hover) {
          transform: scale(1.06);
        }
        .extras {
          justify-content: center;
        }
        .extras button {
          margin: 0;
        }
        .threeDots {
          width: 16px;
        }
        .playButton {
          object-fit: cover;
          object-position: center center;
          background-size: 40px 40px;
          background-repeat: no-repeat;
        }
        .add {
          background-color: transparent;
          border: 1px solid #535353;
          border-radius: 500px;
          color: #fff;
          cursor: auto;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 1.76px;
          line-height: 1rem;
          padding: 6px 28px;
          transition: all 33ms cubic-bezier(0.3, 0, 0, 1);
          white-space: nowrap;
          will-change: transform;
          user-select: none;
          text-decoration: none;
          touch-action: manipulation;
          height: initial;
          margin: 0 0 0 20px;
        }
        .add:hover,
        .add:focus {
          transform: scale(1.04);
          border-color: #fff;
        }
        .add:active {
          transform: scale(0.96);
        }

        .trackArtistsContainer {
          display: block;
          align-items: center;
        }
        .options {
          color: #ffffffb3;
        }
        .options:hover,
        .options:focus {
          color: #ffffff;
        }
        p,
        .trackItem :global(.trackName),
        span {
          margin: 0px;
          overflow: hidden;
          text-align: left;
          text-overflow: ellipsis;
          white-space: unset;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          -webkit-line-clamp: 1;
        }
        .time {
          overflow: unset;
          min-width: 50px;
          text-align: center;
        }
        .pop-meter {
          width: 30px;
          height: 9px;
          position: relative;
          margin: 0 auto;
        }
        .pop-meter-bar,
        .pop-meter-overlay {
          width: 100%;
          position: absolute;
          top: -1px;
          height: 9px;
          overflow-x: hidden;
        }
        .pop-meter-bar:after,
        .pop-meter-overlay:after {
          content: " ";
          display: block;
          transform: translate(0, 0.5px);
          position: absolute;
          left: -4px;
          width: 2px;
          height: 8px;
          top: 0;
        }
        .pop-meter-bar:after {
          box-shadow: 4px 0 0 0 #3e3e40, 8px 0 0 0 #3e3e40, 12px 0 0 0 #3e3e40,
            16px 0 0 0 #3e3e40, 20px 0 0 0 #3e3e40, 24px 0 0 0 #3e3e40,
            28px 0 0 0 #3e3e40, 32px 0 0 0 #3e3e40;
        }
        .pop-meter-overlay:after {
          box-shadow: 4px 0 0 0 #88898c, 8px 0 0 0 #88898c, 12px 0 0 0 #88898c,
            16px 0 0 0 #88898c, 20px 0 0 0 #88898c, 24px 0 0 0 #88898c,
            28px 0 0 0 #88898c, 32px 0 0 0 #88898c;
        }
        :global(.trackName),
        .trackArtists :global(a) {
          text-decoration: none;
        }
        :global(.trackName:hover),
        .trackArtists :global(a:hover) {
          text-decoration: underline;
        }

        button {
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
          border: none;
          margin: 0 15px 0 15px;
        }
        :global(.trackName) {
          margin: 0;
          padding: 0;
        }
        p.trackArtists,
        span {
          margin: 0;
          font-family: "Lato", "sans-serif";
          font-weight: 400;
          color: #ffffffb3;
          font-size: 13px;
        }
        strong {
          font-weight: bold;
        }
        section {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          max-width: 100%;
        }
        section:nth-of-type(4) {
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
        .img {
          margin: 0;
          padding: 0;
          margin-right: 23px;
          width: 48px;
          height: 48px;
        }
      `}</style>
    </div>
  );
}

export default memo(CardTrack, (prevProps, nextProps) => {
  return (
    prevProps.track?.id === nextProps.track?.id &&
    prevProps.accessToken === nextProps.accessToken &&
    prevProps.playlistUri === nextProps.playlistUri &&
    prevProps.isTrackInLibrary === nextProps.isTrackInLibrary &&
    prevProps.isSingleTrack === nextProps.isSingleTrack &&
    prevProps.type === nextProps.type &&
    prevProps.position === nextProps.position
  );
});
