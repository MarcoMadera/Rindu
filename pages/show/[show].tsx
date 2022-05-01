import { NextApiRequest, NextApiResponse, NextPage } from "next";
import Link from "next/link";
import ThreeDots from "components/icons/ThreeDots";
import Add from "components/icons/Add";
import { Pause, Play } from "components/icons";
import { useEffect, useMemo, useState } from "react";
import { ExplicitSign } from "components/forPlaylistsPage/CardTrack";
import { formatTime } from "utils/formatTime";
import { getTimeAgo } from "utils/getTimeAgo";
import { getAuth } from "utils/getAuth";
import { serverRedirect } from "utils/serverRedirect";
import { getShow } from "utils/spotifyCalls/getShow";
import { AllTracksFromAPlayList, HeaderType } from "types/spotify";
import { SITE_URL } from "utils/constants";
import { PlaylistPageHeader } from "components/forPlaylistsPage/PlaylistPageHeader";
import { PlayButton } from "components/forPlaylistsPage/PlayButton";
import { Heart, HeartShape } from "components/icons/Heart";
import { removeShowsFromLibrary } from "utils/spotifyCalls/removeShowsFromLibrary";
import { saveShowsToLibrary } from "utils/spotifyCalls/saveShowsToLibrary";
import useAuth from "hooks/useAuth";
import { checkIfUserFollowShows } from "utils/spotifyCalls/checkIfUserFollowShows";
import useSpotify from "hooks/useSpotify";
import { playCurrentTrack } from "utils/playCurrentTrack";

interface PlaylistProps {
  show: SpotifyApi.SingleShowResponse | null;
  accessToken?: string;
  user: SpotifyApi.UserObjectPrivate | null;
}

function EpisodeCard({
  item,
  position,
  show,
}: {
  item: SpotifyApi.EpisodeObjectSimplified;
  position: number;
  show: SpotifyApi.ShowObject;
}) {
  const {
    isPlaying,
    currrentlyPlaying,
    deviceId,
    player,
    allTracks,
    playlistDetails,
    setCurrentlyPlaying,
    setPlaylistPlayingId,
  } = useSpotify();
  const { user, accessToken, setAccessToken } = useAuth();
  const isThisEpisodePlaying = currrentlyPlaying?.uri === item.uri;

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
            <h4>{item.name}</h4>
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
        <button>
          <ThreeDots fill="#b3b3b3" width={24} height={24} />
        </button>
      </div>
      <div className="actions">
        <button>
          <Add fill="#b3b3b3" />
        </button>
        <button>
          <Add fill="#b3b3b3" />
        </button>
      </div>
      <div className="play">
        <button
          onClick={() => {
            if (isThisEpisodePlaying) {
              player?.togglePlay();
              return;
            }
            playCurrentTrack(
              {
                album: {
                  album_type: "single",
                  artists: [
                    {
                      external_urls: {
                        spotify: `https://open.spotify.com/show/${show?.id}`,
                      },
                      name: show.name ?? "",
                      id: show.id ?? "",
                      type: "artist",
                      href: `https://open.spotify.com/show/${show?.id}`,
                      uri: `spotify:show:${show?.id}`,
                    },
                  ],
                  external_urls: { spotify: "" },
                  id: show?.id ?? "",
                  images: item?.images ?? [],
                  name: show?.name ?? "",
                  release_date: item?.release_date ?? "",
                  type: "album",
                  uri: show?.uri ?? "",
                },
                artists: [
                  {
                    external_urls: {
                      spotify: `https://open.spotify.com/show/${show?.id}`,
                    },
                    name: show.name ?? "",
                    id: show.id ?? "",
                    type: "artist",
                    href: `https://open.spotify.com/show/${show?.id}`,
                    uri: `spotify:show:${show?.id}`,
                  },
                ],
                id: item?.id ?? "",
                name: item?.name ?? "",
                explicit: item?.explicit ?? false,
                type: "track",
                uri: item?.uri ?? "",
                href: "",
              },
              {
                player,
                user,
                allTracks,
                accessToken,
                deviceId,
                playlistUri: playlistDetails?.uri,
                playlistId: playlistDetails?.id,
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
        .header h4 {
          align-items: center;
          display: flex;
          overflow: hidden;
          padding: 0px;
          line-height: 24px;
          word-break: break-word;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: normal;
          margin: 0;
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

const Shows: NextPage<PlaylistProps> = ({ show, accessToken, user }) => {
  const [isShowInLibrary, setIsShowInLibrary] = useState(false);
  const { setIsLogin, setAccessToken, setUser } = useAuth();
  const { setPlaylistDetails, setAllTracks } = useSpotify();
  useEffect(() => {
    setIsLogin(true);

    setAccessToken(accessToken);

    setUser(user);
  }, [accessToken, setAccessToken, setIsLogin, setUser, user]);

  useEffect(() => {
    async function fetchData() {
      const userFollowThisShow = await checkIfUserFollowShows(
        [show?.id || ""],
        accessToken
      );
      setIsShowInLibrary(!!userFollowThisShow?.[0]);
    }
    fetchData();
  }, [accessToken, show?.id]);

  const allTracks: AllTracksFromAPlayList | undefined = useMemo(
    () =>
      show?.episodes.items.map((episode) => ({
        album: {
          album_type: "single",
          artists: [
            {
              external_urls: {
                spotify: `https://open.spotify.com/artist/${show?.id}`,
              },
              name: show.publisher ?? "",
              id: show.id ?? "",
              type: "artist",
              href: `https://open.spotify.com/show/${show?.id}`,
              uri: `spotify:show:${show?.id}`,
            },
          ],
          external_urls: { spotify: "" },
          href: "",
          id: show.id ?? "",
          images: show.images ?? [],
          name: show.name ?? "",
          release_date: episode?.release_date ?? "",
          release_date_precision: "year",
          type: "album",
          uri: show?.uri ?? "",
        },
        artists: [
          {
            external_urls: {
              spotify: `https://open.spotify.com/episode/${episode?.id}`,
            },
            name: show.publisher ?? "",
            id: show.id ?? "",
            type: "artist",
            href: `https://open.spotify.com/show/${show?.id}`,
            uri: `spotify:show:${show?.id}`,
          },
        ],
        id: episode?.id ?? "",
        name: episode?.name ?? "",
        disc_number: 1,
        duration_ms: episode?.duration_ms ?? 0,
        explicit: episode?.explicit ?? false,
        preview_url: episode?.audio_preview_url ?? "",
        track_number: 1,
        type: "track",
        uri: episode?.uri ?? "",
        external_ids: {},
        popularity: 0,
        available_markets: [],
        external_urls: { spotify: "" },
        href: "",
      })),
    [show]
  );

  useEffect(() => {
    setAllTracks(allTracks ?? []);
  }, [allTracks, setAllTracks]);

  useEffect(() => {
    setPlaylistDetails({
      collaborative: false,
      description: "",
      external_urls: show?.external_urls ?? { spotify: "" },
      followers: { href: null, total: 0 },
      href: show?.href ?? "",
      id: show?.id ?? "",
      images: show?.images ?? [],
      name: show?.name ?? "",
      tracks: {
        href: show?.href ?? "",
        total: show?.episodes.total ?? 0,
        items:
          show?.episodes.items.map((episode) => ({
            added_at: episode.release_date ?? "",
            added_by: {
              type: "user",
              href: "",
              images: [],
              external_urls: { spotify: "" },
              id: "",
              uri: "",
              display_name: "",
              followers: { href: null, total: 0 },
            },
            is_local: false,
            track: {
              album: {
                album_type: "single",
                artists: [
                  {
                    external_urls: {
                      spotify: `https://open.spotify.com/artist/${show?.id}`,
                    },
                    name: show.publisher ?? "",
                    id: show.id ?? "",
                    type: "artist",
                    href: `https://open.spotify.com/show/${show?.id}`,
                    uri: `spotify:show:${show?.id}`,
                  },
                ],
                external_urls: { spotify: "" },
                href: "",
                id: show.id ?? "",
                images: show.images ?? [],
                name: show.name ?? "",
                release_date: episode?.release_date ?? "",
                release_date_precision: "year",
                type: "album",
                uri: show?.uri ?? "",
              },
              artists: [
                {
                  external_urls: {
                    spotify: `https://open.spotify.com/episode/${episode?.id}`,
                  },
                  name: show.publisher ?? "",
                  id: show.id ?? "",
                  type: "artist",
                  href: `https://open.spotify.com/show/${show?.id}`,
                  uri: `spotify:show:${show?.id}`,
                },
              ],
              id: episode?.id ?? "",
              name: episode?.name ?? "",
              disc_number: 1,
              duration_ms: episode?.duration_ms ?? 0,
              explicit: episode?.explicit ?? false,
              preview_url: episode?.audio_preview_url ?? "",
              track_number: 1,
              type: "track",
              uri: episode?.uri ?? "",
              external_ids: {},
              popularity: 0,
              available_markets: [],
              external_urls: { spotify: "" },
              href: "",
            },
          })) ?? [],
        limit: 1,
        next: "",
        offset: 0,
        previous: "",
      },
      owner: {
        type: "user",
        href: "",
        images: [],
        external_urls: { spotify: "" },
        id: "",
        uri: "",
        display_name: "",
        followers: { href: null, total: 0 },
      },
      public: true,
      snapshot_id: "",
      type: "playlist",
      uri: show?.uri ?? "",
    });
  }, [setPlaylistDetails, show]);

  return (
    <main>
      <PlaylistPageHeader
        type={HeaderType.podcast}
        title={show?.name ?? ""}
        coverImg={
          show?.images?.[0]?.url ??
          show?.images?.[1]?.url ??
          `${SITE_URL}/defaultSongCover.jpeg`
        }
        ownerDisplayName={show?.publisher ?? ""}
        ownerId={show?.id ?? ""}
      />
      <section>
        <div className="options">
          <PlayButton size={56} centerSize={28} />
          <div className="info">
            <button
              onClick={() => {
                if (!show) return;
                if (isShowInLibrary) {
                  removeShowsFromLibrary([show.id]).then((res) => {
                    if (res) {
                      setIsShowInLibrary(false);
                    }
                  });
                } else {
                  saveShowsToLibrary([show.id]).then((res) => {
                    if (res) {
                      setIsShowInLibrary(true);
                    }
                  });
                }
              }}
            >
              {isShowInLibrary ? (
                <Heart width={36} height={36} />
              ) : (
                <HeartShape fill="#ffffffb3" width={36} height={36} />
              )}
            </button>
          </div>
        </div>
        <div className="content">
          <div className="episodes">
            {show?.episodes.items.map((item, i) => {
              return (
                <EpisodeCard
                  key={item.id}
                  item={item}
                  show={show}
                  position={i}
                />
              );
            })}
          </div>
          <div className="description">
            <h2>About</h2>
            <p>{show?.description}</p>
          </div>
        </div>
      </section>
      <style jsx>{`
        main {
          display: block;
          margin: -60px auto 0 auto;
          height: calc(100vh - 90px);
          width: calc(100vw - 245px);
        }
        @media (max-width: 1000px) {
          main {
            width: 100vw;
          }
        }
        .content {
          display: grid;
          grid-template-columns: 700px 1fr;
        }
        section {
          margin: 0 32px;
          position: relative;
          z-index: 1;
        }
        div.info {
          align-self: flex-end;
          width: calc(100% - 310px);
        }
        .info button {
          margin-left: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 56px;
          height: 56px;
          min-width: 56px;
          min-height: 56px;
          background-color: transparent;
          border: none;
        }
        .info button:focus,
        .info button:hover {
          transform: scale(1.06);
        }
        .info button:active {
          transform: scale(1);
        }
        .options {
          display: flex;
          padding: 24px 0;
          position: relative;
          width: 100%;
          align-items: center;
          flex-direction: row;
        }
        h2 {
          color: #fff;
          display: inline-block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 28px;
          text-transform: none;
          margin: 0;
        }
        p {
          font-size: 1rem;
          line-height: 1.5rem;
          text-transform: none;
          letter-spacing: normal;
          font-weight: 400;
          box-sizing: border-box;
          color: #b3b3b3;
          font-family: "Lato", sans-serif;
        }
      `}</style>
    </main>
  );
};

export default Shows;

export async function getServerSideProps({
  params: { show },
  req,
  res,
}: {
  params: { show: string };
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  props: PlaylistProps | null;
}> {
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  const showData = await getShow(show, accessToken);

  return {
    props: {
      show: showData,
      accessToken,
      user: user ?? null,
    },
  };
}
