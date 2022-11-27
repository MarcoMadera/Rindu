import useAuth from "hooks/useAuth";
import useContextMenu from "hooks/useContextMenu";
import useSpotify from "hooks/useSpotify";
import useToast from "hooks/useToast";
import Link from "next/link";
import { ReactElement, useState } from "react";
import { AsType } from "types/heading";
import { formatTime } from "utils/formatTime";
import { getTimeAgo } from "utils/getTimeAgo";
import { playCurrentTrack } from "utils/playCurrentTrack";
import { removeEpisodesFromLibrary } from "utils/spotifyCalls/removeEpisodesFromLibrary";
import { saveEpisodesToLibrary } from "utils/spotifyCalls/saveEpisodesToLibrary";
import ExplicitSign from "./ExplicitSign";
import Heading from "./Heading";
import { Pause, Play } from "./icons";
import Add from "./icons/Add";
import { Share } from "./icons/Share";
import ThreeDots from "./icons/ThreeDots";

interface EpisodeCardProps {
  item: SpotifyApi.EpisodeObjectSimplified;
  position: number;
  show: SpotifyApi.ShowObject;
}

export default function EpisodeCard({
  item,
  position,
  show,
}: EpisodeCardProps): ReactElement {
  const {
    isPlaying,
    currentlyPlaying,
    deviceId,
    player,
    allTracks,
    pageDetails,
    setCurrentlyPlaying,
    setPlaylistPlayingId,
    setProgressMs,
  } = useSpotify();
  const { user, accessToken, setAccessToken } = useAuth();
  const { addToast } = useToast();
  const { addContextMenu } = useContextMenu();
  const isThisEpisodePlaying = currentlyPlaying?.uri === item.uri;
  const isPremium = user?.product === "premium";
  const [isEpisodeInLibrary, setIsEpisodeInLibrary] = useState<
    boolean | undefined
  >();

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        const x = e.pageX;
        const y = e.pageY;
        addContextMenu({
          type: "cardTrack",
          data: item,
          position: { x, y },
        });
      }}
    >
      <hr />
      <div className="episodeCard">
        <div className="coverImage">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item?.images?.[1]?.url} alt={item?.name} />
          </div>
        </div>
        <div className="header">
          <Link href={`/episode/${item.id}`}>
            <a>
              <Heading number={5} as={AsType.SPAN}>
                {item.name}
              </Heading>
            </a>
          </Link>
        </div>
        <div className="description">
          <p>{item.description}</p>
        </div>
        <div className="metadata">
          <div>
            <p>
              {item.explicit ? <ExplicitSign /> : null}{" "}
              {getTimeAgo(+new Date(item.release_date), "en")}
            </p>
            <p>
              <span>{formatTime(item.duration_ms / 1000)}</span>
            </p>
          </div>
        </div>
        <div className="actions">
          <Add
            fill="#b3b3b3"
            handleClick={async () => {
              setIsEpisodeInLibrary(!isEpisodeInLibrary);
              if (isEpisodeInLibrary) {
                const removeEpisodeRes = await removeEpisodesFromLibrary([
                  item.id,
                ]);
                if (removeEpisodeRes) {
                  addToast({
                    message: "Episode removed from library",
                    variant: "success",
                  });
                }
                return false;
              } else {
                const saveEpisodesToLibraryRes = await saveEpisodesToLibrary([
                  item.id,
                ]);
                if (saveEpisodesToLibraryRes) {
                  addToast({
                    message: "Episode added to library",
                    variant: "success",
                  });
                }
                return true;
              }
            }}
          />
          <button
            type="button"
            aria-label="Share"
            onClick={() => {
              navigator.clipboard.writeText(
                `https://rindu.app/episode/${item.id}`
              );
              addToast({
                message: "Link copied to clipboard",
                variant: "success",
              });
            }}
          >
            <Share fill="#b3b3b3" />
          </button>
          <button
            type="button"
            aria-label="More options"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              const x = e.pageX;
              const y = e.pageY;
              addContextMenu({
                type: "cardTrack",
                data: item,
                position: { x, y },
              });
            }}
          >
            <ThreeDots fill="#b3b3b3" width={24} height={24} />
          </button>
        </div>
        <div className="play">
          <button
            type="button"
            onClick={() => {
              if (isThisEpisodePlaying) {
                player?.togglePlay();
                return;
              }
              if (isPremium) {
                (player as Spotify.Player)?.activateElement();
              }
              playCurrentTrack(
                {
                  album: {
                    id: show?.id,
                    images: item?.images ?? [],
                    name: show?.name,
                    release_date: item?.release_date,
                    type: "album",
                    uri: show?.uri,
                  },
                  artists: [
                    {
                      name: show.name,
                      id: show.id,
                      type: "artist",
                      uri: `spotify:show:${show?.id}`,
                    },
                  ],
                  id: item?.id,
                  name: item?.name,
                  explicit: item?.explicit ?? false,
                  type: "track",
                  uri: item?.uri,
                },
                {
                  player,
                  user,
                  allTracks,
                  accessToken,
                  deviceId,
                  playlistUri: pageDetails?.uri,
                  playlistId: pageDetails?.id,
                  setCurrentlyPlaying,
                  setPlaylistPlayingId,
                  isSingleTrack: true,
                  position,
                  setAccessToken,
                  setProgressMs,
                }
              );
            }}
          >
            {isThisEpisodePlaying && isPlaying ? <Pause /> : <Play />}
          </button>
        </div>
      </div>
      <style jsx>{`
        .episodeCard {
          align-items: center;
          display: grid;
          grid-template-areas:
            "coverImage header header header topActions"
            "coverImage description description description description"
            "coverImage play metadata actions actions";
          grid-template-columns: min-content min-content 1fr min-content;
          grid-template-rows: auto;
          border-radius: 4px;
          color: #b3b3b3;
          cursor: pointer;
          margin: 0px -16px;
          padding: 16px;
          max-width: 700px;
        }
        .episodeCard:hover,
        .episodeCard:focus-within {
          background-color: rgba(255, 255, 255, 0.1);
        }
        hr {
          border-color: hsla(0, 0%, 100%, 0.1);
          max-width: calc(100% - 32px);
        }
        .coverImage {
          grid-area: coverImage;
          align-self: flex-start;
        }
        .coverImage img {
          box-shadow: rgb(0 0 0 / 50%) 0px 4px 60px;
          height: 100%;
          width: 100%;
          border-radius: 8px;
          object-fit: cover;
          object-position: center center;
        }
        .coverImage div {
          margin: 0px 24px 0px 0px;
          width: 112px;
          height: 112px;
        }
        .header {
          grid-area: header;
          align-items: flex-start;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .header a {
          color: #fff;
          text-decoration: none;
        }
        .header a:hover {
          text-decoration: underline;
        }
        .description {
          grid-area: description;
        }
        .description p {
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          margin: 12px 0px;
          overflow: hidden;
          padding: 0px;
          word-break: break-word;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: normal;
          line-height: 16px;
          text-transform: none;
        }
        .metadata {
          grid-area: metadata;
          margin: 0px 0px 0px 16px;
          display: flex;
          gap: 8px;
        }
        .metadata div {
          align-items: center;
          color: rgba(255, 255, 255, 0.6);
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
        }
        .metadata p {
          font-size: 14px;
          font-weight: 400;
          letter-spacing: normal;
          line-height: 14px;
          text-transform: none;
          margin: 0px;
        }
        .metadata div p:nth-of-type(2)::before {
          content: "·";
          margin: 0px 4px;
        }
        .metadata span {
          color: rgba(255, 255, 255, 0.7);
          white-space: nowrap;
        }
        .episodeCard:hover .topActions button {
          opacity: 1;
        }
        .actions {
          grid-area: actions;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 1.2rem;
        }
        .actions :global(button) {
          background-color: transparent;
          border: 0;
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          padding: 0;
          opacity: 0;
          font-family: "Lato";
          transition: opacity 0.2s ease-in-out;
          display: flex;
          align-items: center;
        }
        .actions :global(button:hover) {
          color: #fff;
        }
        .episodeCard:hover .actions :global(button) {
          opacity: 1;
        }
        .play {
          grid-area: play;
        }
        .play button {
          border-radius: 50%;
          background-color: #fff;
          border: none;
          display: flex;
          font-size: 8px;
          justify-content: center;
          height: 32px;
          min-height: 32px;
          min-width: 32px;
          width: 32px;
          justify-content: center;
          align-items: center;
        }
        .play button:hover,
        .play button:focus {
          transform: scale(1.1);
        }
        .play button:active {
          transform: scale(1);
        }
      `}</style>
    </div>
  );
}
