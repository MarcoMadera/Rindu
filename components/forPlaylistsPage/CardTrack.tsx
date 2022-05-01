import { Pause, Play, Playing } from "components/icons";
import { Heart, HeartShape } from "components/icons/Heart";
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
  } = useSpotify();
  const [mouseEnter, setMouseEnter] = useState(false);
  const [isHoveringHeart, setIsHoveringHeart] = useState(false);
  const [isFocusing, setIsFocusing] = useState(false);
  const [isLikedTrack, setIsLikedTrack] = useState(isTrackInLibrary);
  const trackRef = useRef<HTMLDivElement>();
  const { user, setAccessToken } = useAuth();
  const { addContextMenu } = useContextMenu();
  const { addToast } = useToast();
  const isPremium = user?.product === "premium";

  const isPlayable =
    track.type === "episode" ||
    (!isPremium && track?.audio) ||
    (isPremium && !(track?.is_playable === false) && !track?.is_local);

  const isTheSameAsCurrentlyPlaying = currrentlyPlaying?.name === track?.name;

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
    });
    const source = playlistDetails?.uri;
    const isCollection = source?.split(":")?.[3];
    setPlayedSource(
      isCollection && playlistDetails
        ? `spotify:${playlistDetails?.type}:${playlistDetails?.id}`
        : source
    );
  }

  return (
    <div
      style={style}
      className="trackItem"
      onDoubleClick={() => {
        if (isPlayable) {
          playThisTrack();
        }
      }}
      role="button"
      tabIndex={0}
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
          e.preventDefault();
          if (isPlaying && isTheSameAsCurrentlyPlaying) {
            player?.pause();
            setIsPlaying(false);
            setPlaylistPlayingId(playlistDetails?.id);
          } else {
            playThisTrack();
          }
        }
      }}
    >
      <button
        className="playbutton"
        onClick={() => {
          if (isPlaying && isTheSameAsCurrentlyPlaying && isPlayable) {
            player?.pause();
            setIsPlaying(false);
            return;
          }
          if (isPlayable) {
            playThisTrack();
          }
        }}
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
                <Fragment key={artist.id}>
                  <Link href={`/${artist.type ?? "artist"}/${artist.id}`}>
                    <a>{artist.name}</a>
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
                <a>{track?.album?.name}</a>
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
        <button
          onMouseEnter={() => {
            setIsHoveringHeart(true);
          }}
          onMouseLeave={() => {
            setIsHoveringHeart(false);
          }}
          onClick={() => {
            const removeFromLibrary =
              track.type === "episode"
                ? removeEpisodesFromLibrary
                : removeTracksFromLibrary;
            if (isLikedTrack) {
              removeFromLibrary([track.id ?? ""], accessToken).then((res) => {
                if (res) {
                  setIsLikedTrack(false);
                  addToast({
                    variant: "success",
                    message: `${
                      track.type === "episode" ? "Episode" : "Song"
                    } removed from library.`,
                  });
                }
              });
            } else {
              const saveToLibrary =
                track.type === "episode"
                  ? saveEpisodesToLibrary
                  : saveTracksToLibrary;
              saveToLibrary([track.id ?? ""], accessToken).then((res) => {
                if (res) {
                  setIsLikedTrack(true);
                  addToast({
                    variant: "success",
                    message: `${
                      track.type === "episode" ? "Episode" : "Song"
                    } added to library`,
                  });
                }
              });
            }
          }}
        >
          {isLikedTrack ? (
            <Heart />
          ) : (mouseEnter || isFocusing) && !track?.is_local ? (
            <HeartShape fill={isHoveringHeart ? "#fff" : "#ffffffb3"} />
          ) : (
            <div style={{ width: "16px" }}></div>
          )}
        </button>
        <p className="trackArtists time">
          {track?.duration ? formatTime((track?.duration || 0) / 1000) : ""}
        </p>

        {onClickAdd && (
          <button className="add" onClick={onClickAdd}>
            Add
          </button>
        )}
        <button className="options">
          {mouseEnter || isFocusing ? (
            <ThreeDots />
          ) : (
            <div style={{ width: "16px" }}></div>
          )}
        </button>
      </section>
      <style jsx>{`
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
        .playbutton {
          background-image: ${type === "presentation"
            ? `url(${track?.images?.[2]?.url ?? track?.images?.[1]?.url})`
            : "unset"};
          object-fit: cover;
          object-position: center center;
          background-size: 40px 40px;
          background-repeat: no-repeat;
        }
        .trackArtistsContainer {
          display: block;
          align-items: center;
        }
        .options {
          margin-right: 20px;
        }
        .trackItem {
          opacity: ${isPlayable ? 1 : 0.4};
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
          color: ${mouseEnter || isFocusing ? "#fff" : "inherit"};
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
          width: ${type !== "presentation" ? "32" : "40"}px;
          height: ${type !== "presentation" ? "32" : "40"}px;
          margin: 0 15px 0 15px;
        }
        p.trackName {
          color: ${isTheSameAsCurrentlyPlaying ? "#1db954" : "#fff"};
          margin: 0;
          padding: 0;
        }
        p.trackArtists,
        span {
          margin: 0;
          font-family: "Lato", "sans-serif";
          font-weight: 400;
          color: #b3b3b3;
          font-size: 14px;
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
          background-color: ${isTheSameAsCurrentlyPlaying
            ? "#2020204d"
            : "transparent"};
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
          grid-template-columns: ${type === "playlist"
            ? "[index] 48px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(160px,1fr)"
            : type === "album"
            ? "[index] 48px [first] 6fr [last] minmax(180px,1fr)"
            : "[index] 55px [first] 4fr [last] minmax(180px,1fr)"};
        }
        .trackItem:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .trackItem:focus {
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
