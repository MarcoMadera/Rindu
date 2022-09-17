import useAuth from "hooks/useAuth";
import useSpotify from "hooks/useSpotify";
import useToast from "hooks/useToast";
import Link from "next/link";
import { ReactElement } from "react";
import { AsType } from "types/heading";
import { formatTime } from "utils/formatTime";
import { getTimeAgo } from "utils/getTimeAgo";
import { playCurrentTrack } from "utils/playCurrentTrack";
import ExplicitSign from "./ExplicitSign";
import Heading from "./Heading";
import { Pause, Play } from "./icons";
import Add from "./icons/Add";
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
    currrentlyPlaying,
    deviceId,
    player,
    allTracks,
    pageDetails,
    setCurrentlyPlaying,
    setPlaylistPlayingId,
  } = useSpotify();
  const { user, accessToken, setAccessToken } = useAuth();
  const { addToast } = useToast();
  const isThisEpisodePlaying = currrentlyPlaying?.uri === item.uri;
  const isPremium = user?.product === "premium";

  return (
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
      <div className="topActions">
        <button
          type="button"
          aria-label="More options"
          onClick={() => {
            addToast({
              message: "Coming soon",
              variant: "info",
            });
          }}
        >
          <ThreeDots fill="#b3b3b3" width={24} height={24} />
        </button>
      </div>
      <div className="actions">
        <button
          type="button"
          aria-label="Add"
          onClick={() => {
            addToast({
              message: "Coming soon",
              variant: "info",
            });
          }}
        >
          <Add fill="#b3b3b3" />
        </button>
        <button
          type="button"
          aria-label="Add"
          onClick={() => {
            addToast({
              message: "Coming soon",
              variant: "info",
            });
          }}
        >
          <Add fill="#b3b3b3" />
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
              }
            );
          }}
        >
          {isThisEpisodePlaying && isPlaying ? <Pause /> : <Play />}
        </button>
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
        .topActions {
          grid-area: topActions;
          display: flex;
          justify-content: flex-end;
        }
        .topActions button {
          opacity: 0;
          background: transparent;
          border: 0;
          padding: 0;
          font-family: "Lato";
        }
        .episodeCard:hover .topActions button {
          opacity: 1;
        }
        .actions {
          grid-area: actions;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        .actions button {
          background-color: transparent;
          border: 0;
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          padding: 0;
          opacity: 0;
          font-family: "Lato";
        }
        .episodeCard:hover .actions button {
          opacity: 1;
        }
        .actions button:nth-of-type(1) {
          margin: 0px 24px 0px 0px;
          font-weight: 700;
          border-radius: 500px;
          display: inline-block;
          position: relative;
          text-align: center;
          text-decoration: none;
          box-sizing: border-box;
          transition-property: background-color, border-color, color, box-shadow,
            filter, transform;
          user-select: none;
          vertical-align: middle;
          transform: translate3d(0px, 0px, 0px);
          color: #575757;
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
