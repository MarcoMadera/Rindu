import Head from "next/head";
import useHeader from "hooks/useHeader";
import { useEffect, ReactElement, useState } from "react";
import { NextApiRequest, NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { getAuth } from "utils/getAuth";
import { serverRedirect } from "utils/serverRedirect";
import { getTrack } from "utils/spotifyCalls/getTrack";
import { getLyrics } from "utils/getLyrics";
import { ExtraHeader } from "layouts/playlist/ExtraHeader";
import useSpotify from "hooks/useSpotify";
import { PlaylistPageHeader } from "components/forPlaylistsPage/PlaylistPageHeader";
import { PlayButton } from "components/forPlaylistsPage/PlayButton";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";
import { Heart, HeartShape } from "components/icons/Heart";
import { removeTracksFromLibrary } from "utils/spotifyCalls/removeTracksFromLibrary";
import { saveTracksToLibrary } from "utils/spotifyCalls/saveTracksToLibrary";
import ModalCardTrack from "components/forPlaylistsPage/CardTrack";
import { getArtistTopTracks } from "utils/spotifyCalls/getArtistTopTracks";
import { getArtistById } from "utils/spotifyCalls/getArtistById";
import Link from "next/link";

function BigPill({
  img,
  title,
  subTitle,
  href,
}: {
  img: string | undefined;
  title: string;
  subTitle: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <a className="big-pill">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="img" src={img} alt={title} />
        ) : (
          <div className="img"></div>
        )}
        <div className="big-pill-content">
          <span>{title}</span>
          <h2>{subTitle}</h2>
        </div>
        <style jsx>{`
          .big-pill {
            display: flex;
            align-items: center;
            width: 100%;
            height: 100%;
            background-color: transparent;
            border-radius: 8px;
            position: relative;
            z-index: 1;
            gap: 20px;
            text-decoration: none;
            color: inherit;
            padding: 10px;
          }
          .big-pill:hover,
          .big-pill:focus {
            background-color: rgba(255, 255, 255, 0.1);
          }
          .big-pill .img {
            width: 100px;
            min-width: 100px;
            min-height: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            object-position: center center;
          }
          .big-pill-content {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
          }
          .big-pill-content h2 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .big-pill-content h3 {
            font-size: 1rem;
            font-weight: bold;
            margin-bottom: 10px;
          }
        `}</style>
      </a>
    </Link>
  );
}

interface TrackPageProps {
  track: SpotifyApi.TrackObjectFull | null;
  lyrics: string | null;
  accessToken: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
}

export default function TrackPage({
  track,
  lyrics,
  accessToken,
  user,
}: TrackPageProps): ReactElement {
  const { setElement, setHeaderColor, headerColor } = useHeader({
    showOnFixed: false,
  });
  const { setUser, setAccessToken } = useAuth();
  const [isTrackInLibrary, setIsTrackInLibrary] = useState(false);
  const [showMoreTopTracks, setShowMoreTopTracks] = useState(false);
  const [artistTopTracks, setArtistTopTracks] = useState<
    SpotifyApi.TrackObjectFull[]
  >([]);
  const { setPlaylistDetails, setAllTracks, playlistDetails } = useSpotify();
  const [artistInfo, setArtistInfo] =
    useState<SpotifyApi.SingleArtistResponse | null>(null);

  useEffect(() => {
    if (track) {
      setPlaylistDetails({
        name: track.name,
        owner: {
          ...track.artists[0],
          type: "user",
          display_name: track.artists[0].name,
        },
        tracks: {
          items: [
            {
              added_at: "",
              added_by: { ...track.artists[0], type: "user" },
              is_local: false,
              track,
            },
          ],
          total: 1,
          href: "",
          limit: 0,
          next: "",
          offset: 0,
          previous: "",
        },
        collaborative: false,
        description: "",
        external_urls: track.external_urls,
        followers: {
          href: null,
          total: 0,
        },
        href: track.href,
        id: track.id,
        images: track.album.images,
        public: true,
        snapshot_id: "",
        type: "playlist",
        uri: track.uri,
      });

      const artistTopTracksFor = artistTopTracks.map((track) => ({
        ...track,
        audio: track.preview_url,
      }));

      setAllTracks([
        { ...track, audio: track.preview_url },
        ...artistTopTracksFor,
      ]);
    }
    setElement(() => <ExtraHeader isSingle track={track ?? undefined} />);

    return () => {
      setElement(null);
    };
  }, [
    artistTopTracks,
    setAllTracks,
    setElement,
    setHeaderColor,
    setPlaylistDetails,
    track,
  ]);

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
    }
    setUser(user);
  }, [user, accessToken, setUser, setAccessToken]);

  useEffect(() => {
    if (!track) return;
    checkTracksInLibrary([track.id]).then((res) => {
      if (res && res[0]) {
        setIsTrackInLibrary(true);
      }
    });
  }, [track]);

  useEffect(() => {
    if (!track || !accessToken) return;
    getArtistTopTracks(
      track.artists[0].id,
      user?.country ?? "US",
      accessToken
    ).then((res) => {
      if (res) {
        setArtistTopTracks(res.tracks);
      }
    });

    getArtistById(track.artists[0].id, accessToken).then((res) => {
      if (res) {
        setArtistInfo(res);
      }
    });
  }, [accessToken, track, user?.country]);

  return (
    <main>
      <Head>
        <title>Rindu - {track?.name ?? "Canciones"}</title>
      </Head>
      <section>
        <PlaylistPageHeader type={"SONG"} playlistDetails={playlistDetails} />
        <div className="tracksContainer">
          <div className="bg-12"></div>
          <div className="content">
            <div className="options">
              <PlayButton
                size={56}
                centerSize={28}
                isSingle
                track={track ?? undefined}
              />
              <div className="info">
                <button
                  onClick={() => {
                    if (!track) return;
                    if (isTrackInLibrary) {
                      removeTracksFromLibrary([track.id]).then((res) => {
                        if (res) {
                          setIsTrackInLibrary(false);
                        }
                      });
                    } else {
                      saveTracksToLibrary([track.id]).then((res) => {
                        if (res) {
                          setIsTrackInLibrary(true);
                        }
                      });
                    }
                  }}
                >
                  {isTrackInLibrary ? (
                    <Heart width={36} height={36} />
                  ) : (
                    <HeartShape fill="#ffffffb3" width={36} height={36} />
                  )}
                </button>
              </div>
            </div>
            {lyrics ? (
              <div className="lyrics-container">
                <h2>Letra</h2>
                <p className="lyrics">{lyrics}</p>
              </div>
            ) : null}
            {artistInfo && (
              <BigPill
                img={artistInfo?.images?.[0]?.url}
                title={"ARTIST"}
                subTitle={artistInfo.name}
                href={`/artist/${artistInfo.id}`}
              />
            )}
            {artistTopTracks.length > 0 && (
              <div className="topTracks">
                <div className="topTracks-header">
                  <span className="topTracks-header-d">
                    Canciones populares de
                  </span>
                  <h2>{track?.artists[0].name ?? ""}</h2>
                </div>
                {artistTopTracks?.map((track, i) => {
                  const maxToShow = showMoreTopTracks ? 10 : 5;
                  if (i >= maxToShow) {
                    return null;
                  }
                  return (
                    <ModalCardTrack
                      accessToken={accessToken ?? ""}
                      isTrackInLibrary={false}
                      playlistUri=""
                      track={{
                        ...track,
                        media_type: "audio",
                        audio: track.preview_url,
                        images: track.album.images,
                        duration: track.duration_ms,
                        position: i,
                      }}
                      key={track.id}
                      type="playlist"
                      position={i + 1}
                      isSingleTrack
                    />
                  );
                })}
                <button
                  className="show-more"
                  onClick={() => {
                    setShowMoreTopTracks((prev) => !prev);
                  }}
                >
                  {showMoreTopTracks ? "MOSTRAR MENOS" : "MOSTRAR MÁS"}
                </button>
              </div>
            )}
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
        section {
          display: flex;
          flex-direction: column;
          margin: 0 auto;
          padding: 0;
        }
        .topTracks-header {
          display: block;
          margin-bottom: 20px;
          width: 100%;
        }
        .topTracks-header span {
          display: block;
          color: rgb(179, 179, 179);
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
          margin: 16px 0;
          flex-direction: row;
        }
        button.show-more:hover {
          color: white;
        }
        button.show-more {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          padding: 18px;
          font-weight: bold;
        }
        .bg-12 {
          background-image: linear-gradient(rgba(0, 0, 0, 0.6) 0, #121212 100%),
            url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=");
          height: 232px;
          position: absolute;
          width: 100%;
          background-color: ${headerColor ?? "transparent"};
        }
        .content {
          margin: 0 32px;
        }
        .lyrics-container {
          position: relative;
          margin: 20px 0;
          z-index: 1;
        }
        .lyrics {
          color: rgb(179, 179, 179);
          font-weight: 400;
          letter-spacing: -0.04em;
          margin: 0;
          white-space: pre;
          font-size: 1rem;
          line-height: 1.5rem;
          text-transform: none;
          letter-spacing: normal;
        }
        .topTracks {
          display: flex;
          flex-wrap: wrap;
          margin-top: 32px;
          position: relative;
          z-index: 1;
        }
      `}</style>
    </main>
  );
}

export async function getServerSideProps({
  params: { id },
  req,
  res,
}: {
  params: { id: string };
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  props: TrackPageProps | null;
}> {
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};
  const track = await getTrack(id, user?.country ?? "US", accessToken, cookies);
  let lyrics: string | null = null;

  if (track?.name && track.artists[0].name) {
    lyrics = await getLyrics(track.artists[0].name, track.name);
  }

  return {
    props: {
      track,
      lyrics,
      accessToken: accessToken ?? null,
      user: user ?? null,
    },
  };
}
