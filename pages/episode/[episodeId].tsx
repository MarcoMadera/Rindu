import Head from "next/head";
import useHeader from "hooks/useHeader";
import { useEffect, ReactElement, useState, useMemo } from "react";
import { NextApiRequest, NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { getAuth } from "utils/getAuth";
import { serverRedirect } from "utils/serverRedirect";
import PlaylistTopBarExtraField from "components/PlaylistTopBarExtraField";
import PageHeader from "../../components/PageHeader";
import { PlayButton } from "components/PlayButton";
import { getEpisodeById } from "utils/spotifyCalls/getEpisodeById";
import { SITE_URL } from "utils/constants";
import { HeaderType } from "types/pageHeader";
import Link from "next/link";
import { checkEpisodesInLibrary } from "utils/spotifyCalls/checkEpisodesInLibrary";
import { removeEpisodesFromLibrary } from "utils/spotifyCalls/removeEpisodesFromLibrary";
import { saveEpisodesToLibrary } from "utils/spotifyCalls/saveEpisodesToLibrary";
import useSpotify from "hooks/useSpotify";
import ContentContainer from "components/ContentContainer";
import Heading from "components/Heading";

interface EpisodePageProps {
  episode: SpotifyApi.EpisodeObject | null;
  accessToken: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
}

export default function EpisodePage({
  episode,
  accessToken,
  user,
}: EpisodePageProps): ReactElement {
  const { setElement } = useHeader({
    showOnFixed: false,
  });
  const { setUser, setAccessToken } = useAuth();
  const [isEpisodeInLibrary, setIsEpisodeInLibrary] = useState(false);
  const { setPageDetails, isPlaying } = useSpotify();
  const episodeTrack: SpotifyApi.TrackObjectFull = useMemo(
    () => ({
      album: {
        album_type: "single",
        artists: [
          {
            external_urls: {
              spotify: `https://open.spotify.com/artist/${episode?.show?.id}`,
            },
            name: episode?.show.publisher ?? "",
            id: episode?.show.id ?? "",
            type: "artist",
            href: `https://open.spotify.com/show/${episode?.show?.id}`,
            uri: `spotify:show:${episode?.show?.id}`,
          },
        ],
        external_urls: { spotify: "" },
        href: "",
        id: episode?.show.id ?? "",
        images: episode?.show.images ?? [],
        name: episode?.show.name ?? "",
        release_date: episode?.release_date ?? "",
        release_date_precision: "year",
        type: "album",
        uri: episode?.show.uri ?? "",
        total_tracks: 1,
      },
      artists: [
        {
          external_urls: {
            spotify: `https://open.spotify.com/artist/${episode?.show?.id}`,
          },
          name: episode?.show.publisher ?? "",
          id: episode?.show.id ?? "",
          type: "artist",
          href: `https://open.spotify.com/show/${episode?.show?.id}`,
          uri: `spotify:show:${episode?.show?.id}`,
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
    }),
    [episode]
  );

  useEffect(() => {
    setElement(() => (
      <PlaylistTopBarExtraField isSingle track={episodeTrack ?? undefined} />
    ));

    return () => {
      setElement(null);
    };
  }, [episodeTrack, setElement]);

  useEffect(() => {
    setPageDetails({
      id: episode?.id,
      uri: episode?.uri,
      type: "playlist",
      name: episode?.name,
      tracks: { total: 1 },
    });
  }, [episode, setPageDetails]);

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
    }
    setUser(user);
  }, [user, accessToken, setUser, setAccessToken]);

  useEffect(() => {
    if (!episode) return;
    checkEpisodesInLibrary([episode.id]).then((res) => {
      if (res && res[0]) {
        setIsEpisodeInLibrary(true);
      }
    });
  }, [episode]);

  return (
    <ContentContainer hasPageHeader>
      {!isPlaying && (
        <Head>
          <title>Rindu - {episode?.name ?? "Canciones"}</title>
        </Head>
      )}
      <PageHeader
        type={HeaderType.episode}
        title={episode?.name ?? "PodCast"}
        coverImg={
          episode?.show?.images?.[0]?.url ??
          episode?.show?.images?.[1]?.url ??
          `${SITE_URL}/defaultSongCover.jpeg`
        }
        ownerId={episode?.show?.id ?? ""}
        ownerDisplayName={episode?.show?.name ?? ""}
      />
      <div className="container">
        <div className="options">
          <PlayButton
            size={56}
            centerSize={28}
            isSingle
            track={episodeTrack ?? undefined}
          />
          <div className="info">
            <button
              type="button"
              className="follow-button"
              onClick={() => {
                if (!episode) return;
                if (isEpisodeInLibrary) {
                  removeEpisodesFromLibrary([episode.id]).then((res) => {
                    if (res) {
                      setIsEpisodeInLibrary(false);
                    }
                  });
                } else {
                  saveEpisodesToLibrary([episode.id]).then((res) => {
                    if (res) {
                      setIsEpisodeInLibrary(true);
                    }
                  });
                }
              }}
            >
              {isEpisodeInLibrary ? "Siguiendo" : "Seguir"}
            </button>
          </div>
        </div>
        <Heading number={3} as="h2">
          Episode description
        </Heading>
        <p>{episode?.description}</p>
        <Link href={`/show/${episode?.show?.id}`}>
          <a>SEE ALL EPISODES</a>
        </Link>
      </div>
      <style jsx>{`
        .container {
          margin: 0 32px;
          position: relative;
          z-index: 1;
        }
        a {
          margin: 40px 0 16px;
          background-color: transparent;
          border: 1px solid #535353;
          border-radius: 500px;
          color: #fff;
          cursor: pointer;
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.76px;
          line-height: 18px;
          padding: 8px 34px;
          text-align: center;
          text-transform: uppercase;
          transition: all 33ms cubic-bezier(0.3, 0, 0, 1);
          white-space: nowrap;
          will-change: transform;
          user-select: none;
          text-decoration: none;
          touch-action: manipulation;
        }
        a:hover {
          transform: scale(1.06);
        }
        p {
          font-size: 1rem;
          line-height: 1.5rem;
          text-transform: none;
          letter-spacing: normal;
          box-sizing: border-box;
          font-family: "Lato", sans-serif;
          margin: 0px;
          font-weight: 400;
          color: #6a6a6a;
          max-width: 672px;
          padding-top: 16px;
        }
        .info .follow-button {
          background-color: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          box-sizing: border-box;
          color: #fff;
          font-size: 16px;
          width: auto;
          font-weight: 700;
          letter-spacing: 0.1em;
          line-height: 16px;
          padding: 7px 15px;
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          margin-right: 24px;
          margin-left: 20px;
        }
        .info button:focus,
        .info button:hover {
          border: 1px solid #fff;
        }
        .options {
          display: flex;
          padding: 24px 0;
          position: relative;
          width: 100%;
          align-items: center;
          margin: 16px 0;
          flex-direction: row;
        }
      `}</style>
    </ContentContainer>
  );
}

export async function getServerSideProps({
  params: { episodeId },
  req,
  res,
}: {
  params: { episodeId: string };
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  props: EpisodePageProps | null;
}> {
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};
  const episode = await getEpisodeById(
    episodeId,
    user?.country ?? "US",
    accessToken,
    cookies
  );

  return {
    props: {
      episode,
      accessToken: accessToken ?? null,
      user: user ?? null,
    },
  };
}
