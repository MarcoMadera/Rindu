import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { getAuth } from "utils/getAuth";
import { serverRedirect } from "utils/serverRedirect";
import { getShow } from "utils/spotifyCalls/getShow";
import { AllTracksFromAPlayList, HeaderType } from "types/spotify";
import { SITE_URL } from "utils/constants";
import PageHeader from "components/PageHeader";
import { PlayButton } from "components/PlayButton";
import { Heart } from "components/icons/Heart";
import { removeShowsFromLibrary } from "utils/spotifyCalls/removeShowsFromLibrary";
import { saveShowsToLibrary } from "utils/spotifyCalls/saveShowsToLibrary";
import useAuth from "hooks/useAuth";
import { checkIfUserFollowShows } from "utils/spotifyCalls/checkIfUserFollowShows";
import useSpotify from "hooks/useSpotify";
import PlaylistTopBarExtraField from "components/PlaylistTopBarExtraField";
import useHeader from "hooks/useHeader";
import useToast from "hooks/useToast";
import EpisodeCard from "components/EpisodeCard";

interface PlaylistProps {
  show: SpotifyApi.SingleShowResponse | null;
  accessToken?: string;
  user: SpotifyApi.UserObjectPrivate | null;
}

const Shows: NextPage<PlaylistProps> = ({ show, accessToken, user }) => {
  const [isShowInLibrary, setIsShowInLibrary] = useState(false);
  const { setIsLogin, setAccessToken, setUser } = useAuth();
  const { setPlaylistDetails, setAllTracks } = useSpotify();
  const { addToast } = useToast();
  const { setElement } = useHeader({
    showOnFixed: false,
  });
  useEffect(() => {
    setIsLogin(true);

    setElement(() => <PlaylistTopBarExtraField uri={show?.uri} />);

    setAccessToken(accessToken);

    setUser(user);
  }, [
    accessToken,
    setAccessToken,
    setElement,
    setIsLogin,
    setUser,
    show?.uri,
    user,
  ]);

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
                total_tracks: 1,
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
      <PageHeader
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
          <PlayButton uri={show?.uri} size={56} centerSize={28} />
          <div className="info">
            <Heart
              active={isShowInLibrary}
              style={{ width: 80, height: 80 }}
              handleLike={async () => {
                if (!show) return null;
                const saveRes = await saveShowsToLibrary([show.id]);
                if (saveRes) {
                  addToast({
                    message: "Podcast added to your library",
                    variant: "success",
                  });
                  return true;
                }
                return null;
              }}
              handleDislike={async () => {
                if (!show) return null;
                const removeRes = await removeShowsFromLibrary([show.id]);
                if (removeRes) {
                  addToast({
                    message: "Podcast removed from your library",
                    variant: "success",
                  });
                  return true;
                }
                return null;
              }}
            />
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
        .info :global(button) {
          margin-left: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: transparent;
          border: none;
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
