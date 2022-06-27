import { Pause, Play, Playing } from "components/icons";
import { Heart } from "components/icons/Heart";
import ThreeDots from "components/icons/ThreeDots";
import useSpotify from "hooks/useSpotify";
import { getTimeAgo } from "utils/getTimeAgo";
import {
  MutableRefObject,
  useRef,
  useState,
  Fragment,
  CSSProperties,
} from "react";
import { normalTrackTypes } from "types/spotify";
import { formatTime } from "utils/formatTime";
import Link from "next/link";
import useAuth from "hooks/useAuth";
import useToast from "hooks/useToast";
import { playCurrentTrack } from "utils/playCurrentTrack";
import { removeTracksFromLibrary } from "utils/spotifyCalls/removeTracksFromLibrary";
import { saveTracksToLibrary } from "utils/spotifyCalls/saveTracksToLibrary";
import { removeEpisodesFromLibrary } from "utils/spotifyCalls/removeEpisodesFromLibrary";
import { saveEpisodesToLibrary } from "utils/spotifyCalls/saveEpisodesToLibrary";
import useContextMenu from "hooks/useContextMenu";
import useOnScreen from "hooks/useOnScreen";

interface ModalCardTrackProps {
  track: normalTrackTypes;
  accessToken: string | undefined;
  playlistUri: string;
  style?: CSSProperties;
  isTrackInLibrary: boolean | undefined;
  type: "presentation" | "playlist" | "album";
  isSingleTrack?: boolean;
  position?: number;
  onClickAdd?: () => void;
  uri?: string;
}

export const ExplicitSign: React.FC = () => {
  return (
    <div>
      <small>E</small>
      <style jsx>{`
        small {
          font-size: 10px;
          font-weight: bold;
          color: #463f3f;
          font-family: "Lato", sans-serif;
        }
        div {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          background-color: #d2d2d2;
          width: 17px;
          height: 17px;
          margin-right: 4px;
        }
      `}</style>
    </div>
  );
};

const ModalCardTrack: React.FC<ModalCardTrackProps> = ({
  accessToken,
  track,
  playlistUri,
  isTrackInLibrary,
  style,
  type,
  isSingleTrack,
  position,
  onClickAdd,
  uri,
}) => {
  const {
    deviceId,
    currrentlyPlaying,
    player,
    isPlaying,
    setIsPlaying,
    allTracks,
    setCurrentlyPlaying,
    playlistDetails,
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

  const isPlayable =
    track?.type === "episode" ||
    (!isPremium && track?.audio) ||
    (isPremium && !(track?.is_playable === false) && !track?.is_local);

  const isTheSameAsCurrentlyPlaying =
    currrentlyPlaying?.name === track?.name &&
    currrentlyPlaying?.album?.name === track?.album?.name;

  function playThisTrack() {
    playCurrentTrack(track, {
      allTracks,
      player,
      user,
      accessToken,
      deviceId,
      playlistUri,
      playlistId: playlistDetails?.id,
      setCurrentlyPlaying,
      setPlaylistPlayingId,
      isSingleTrack,
      position,
      setAccessToken,
      uri,
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
        const source = playlistDetails?.uri;
        const isCollection = source?.split(":")?.[3];
        setPlayedSource(
          isCollection && playlistDetails
            ? `spotify:${playlistDetails?.type}:${playlistDetails?.id}`
            : source ?? track.uri
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

  return (
    <div
      style={style}
      className="trackItem"
      onDoubleClick={() => {
        if (isPlayable) {
          if (track?.corruptedTrack) {
            addToast({
              variant: "error",
              message: "This track is corrupted and cannot be played",
            });
            return;
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
          if (track?.corruptedTrack) {
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
            setPlaylistPlayingId(playlistDetails?.id);
          } else {
            if (isPlayable) {
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
        className="playbutton"
        aria-label={isPlaying && isTheSameAsCurrentlyPlaying ? "Pause" : "Play"}
        onClick={() => {
          if (isPlaying && isTheSameAsCurrentlyPlaying && isPlayable) {
            player?.pause();
            setIsPlaying(false);
            return;
          }
          if (isPlayable) {
            if (track?.corruptedTrack) {
              addToast({
                variant: "error",
                message: "This track is corrupted and cannot be played",
              });
              return;
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
            typeof track?.position === "number" ? track?.position + 1 : ""
          }`}</span>
        )}
      </button>
      <section>
        {type !== "presentation" ? (
          track?.images?.length ? (
            //  eslint-disable-next-line @next/next/no-img-element
            <img
              loading="lazy"
              src={track?.images[2]?.url ?? track?.images[1]?.url}
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
          <p className="trackName">{`${track?.name ?? ""}`}</p>
          <span className="trackArtists">
            {track?.explicit && <ExplicitSign />}
            {track?.artists?.map((artist, i) => {
              return (
                <Fragment key={artist?.id}>
                  <Link href={`/${artist?.type ?? "artist"}/${artist?.id}`}>
                    <a
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                      tabIndex={isVisible ? 0 : -1}
                      aria-hidden={isVisible ? "false" : "true"}
                    >
                      {artist?.name}
                    </a>
                  </Link>
                  {i !== (track?.artists?.length && track?.artists?.length - 1)
                    ? ", "
                    : null}
                </Fragment>
              );
            })}
          </span>
        </div>
      </section>
      {type === "playlist" ? (
        <>
          <section>
            <p className="trackArtists">
              <Link
                href={`/${track?.album?.type ?? "album"}/${track?.album?.id}`}
              >
                <a
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                  tabIndex={isVisible ? 0 : -1}
                  aria-hidden={isVisible ? "false" : "true"}
                >
                  {track?.album?.name}
                </a>
              </Link>
            </p>
          </section>
          <section>
            <p className="trackArtists">
              {track?.added_at
                ? getTimeAgo(+new Date(track?.added_at), "en")
                : null}
            </p>
          </section>
        </>
      ) : null}
      <section>
        <Heart
          className="trackHeart"
          active={!!isTrackInLibrary}
          tabIndex={isVisible ? 0 : -1}
          aria-hidden={isVisible ? "false" : "true"}
          handleLike={async () => {
            const saveToLibrary =
              track?.type === "episode"
                ? saveEpisodesToLibrary
                : saveTracksToLibrary;
            const saveRes = await saveToLibrary([track.id ?? ""], accessToken);
            if (saveRes) {
              setIsLikedTrack(true);
              addToast({
                variant: "success",
                message: `${
                  track?.type === "episode" ? "Episode" : "Song"
                } added to library`,
              });
              return true;
            }
            return null;
          }}
          handleDislike={async () => {
            const removeFromLibrary =
              track?.type === "episode"
                ? removeEpisodesFromLibrary
                : removeTracksFromLibrary;
            const removeRes = await removeFromLibrary(
              [track?.id ?? ""],
              accessToken
            );
            if (removeRes) {
              setIsLikedTrack(false);
              addToast({
                variant: "success",
                message: `${
                  track?.type === "episode" ? "Episode" : "Song"
                } removed from library.`,
              });
              return true;
            }
            return null;
          }}
        />
        <p className="trackArtists time">
          {track?.duration ? formatTime((track?.duration || 0) / 1000) : ""}
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
        .playbutton {
          background-image: ${type === "presentation"
            ? `url(${track?.images?.[2]?.url ?? track?.images?.[1]?.url})`
            : "unset"};
        }
        .trackItem :global(.trackHeart) {
          opacity: ${isLikedTrack || isFocusing || mouseEnter ? "1" : "0"};
        }
        a {
          color: ${mouseEnter || isFocusing ? "#fff" : "inherit"};
        }
        .trackItem {
          opacity: ${isPlayable ? 1 : 0.4};
        }
        button {
          width: ${type !== "presentation" ? "32" : "40"}px;
          height: ${type !== "presentation" ? "32" : "40"}px;
        }
        p.trackName {
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
            ? "[index] 48px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(160px,1fr)"
            : type === "album"
            ? "[index] 48px [first] 6fr [last] minmax(180px,1fr)"
            : "[index] 55px [first] 4fr [last] minmax(180px,1fr)"};
        }
      `}</style>
      <style jsx>{`
        :global(.trackHeart:focus),
        :global(.trackHeart:hover) {
          transform: scale(1.06);
        }
        .threeDots {
          width: 16px;
        }
        .playbutton {
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
          margin-right: 20px;
          margin-left: 0;
          color: #ffffffb3;
        }
        .options:hover,
        .options:focus {
          color: #ffffff;
        }
        p,
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
        a {
          text-decoration: none;
        }
        a:hover {
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
        p.trackName {
          margin: 0;
          padding: 0;
        }
        p.trackArtists,
        span {
          margin: 0;
          font-family: "Lato", "sans-serif";
          font-weight: 400;
          color: #b3b3b3;
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
};

export default ModalCardTrack;
