import Head from "next/head";
import useHeader from "hooks/useHeader";
import { useEffect, ReactElement, useState } from "react";
import { NextApiRequest, NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { getAuth } from "utils/getAuth";
import { serverRedirect } from "utils/serverRedirect";
import { getTrack } from "utils/spotifyCalls/getTrack";
import { getLyrics } from "utils/getLyrics";
import PlaylistTopBarExtraField from "components/PlaylistTopBarExtraField";
import useSpotify from "hooks/useSpotify";
import PageHeader from "components/PageHeader";
import { PlayButton } from "components/PlayButton";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";
import { Heart } from "components/icons/Heart";
import { removeTracksFromLibrary } from "utils/spotifyCalls/removeTracksFromLibrary";
import { saveTracksToLibrary } from "utils/spotifyCalls/saveTracksToLibrary";
import CardTrack from "components/CardTrack";
import { getArtistTopTracks } from "utils/spotifyCalls/getArtistTopTracks";
import { getArtistById } from "utils/spotifyCalls/getArtistById";
import { HeaderType } from "types/pageHeader";
import { SITE_URL } from "utils/constants";
import useToast from "hooks/useToast";
import BigPill from "components/BigPill";
import { within } from "utils/whitin";
import ContentContainer from "components/ContentContainer";
import Heading from "components/Heading";

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
  const { setElement, setHeaderColor } = useHeader({
    showOnFixed: false,
  });
  const { setUser, setAccessToken } = useAuth();
  const [isTrackInLibrary, setIsTrackInLibrary] = useState(false);
  const [showMoreTopTracks, setShowMoreTopTracks] = useState(false);
  const [artistTopTracks, setArtistTopTracks] = useState<
    SpotifyApi.TrackObjectFull[]
  >([]);
  const { setPageDetails, setAllTracks, isPlaying } = useSpotify();
  const [artistInfo, setArtistInfo] =
    useState<SpotifyApi.SingleArtistResponse | null>(null);
  const [sameTrackIndex, setSameTrackIndex] = useState(-1);
  const { addToast } = useToast();

  useEffect(() => {
    if (track) {
      setPageDetails({
        name: track.name,
        owner: {
          id: track.artists[0].id,
          display_name: track.artists[0].name,
        },
        tracks: {
          total: 1,
        },
        id: track.id,
        images: track.album.images,
        type: "playlist",
        uri: track.uri,
      });

      const sameTrackIdx = artistTopTracks.findIndex(
        (artistTrack) => artistTrack.uri === track.uri
      );

      setSameTrackIndex(sameTrackIdx);

      setAllTracks([track, ...artistTopTracks]);
    }
    setElement(() => (
      <PlaylistTopBarExtraField isSingle track={track ?? undefined} />
    ));

    return () => {
      setElement(null);
    };
  }, [
    artistTopTracks,
    setAllTracks,
    setElement,
    setHeaderColor,
    setPageDetails,
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
      if (res) {
        setIsTrackInLibrary(res[0]);
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
    <ContentContainer hasPageHeader>
      {!isPlaying && (
        <Head>
          <title>Rindu - {track?.name ?? "Canciones"}</title>
        </Head>
      )}
      <PageHeader
        type={HeaderType.song}
        title={track?.name ?? ""}
        coverImg={
          track?.album?.images?.[0]?.url ??
          track?.album?.images?.[1]?.url ??
          `${SITE_URL}/defaultSongCover.jpeg`
        }
        duration_s={track?.duration_ms ? track?.duration_ms / 1000 : 0}
        artists={track?.artists ?? []}
        release_date={track?.album?.release_date ?? ""}
        data={track}
      />
      <div className="tracksContainer">
        <div className="content">
          <div className="options">
            <PlayButton
              size={56}
              centerSize={28}
              isSingle
              track={track ?? undefined}
            />
            <div className="info">
              <Heart
                active={isTrackInLibrary}
                style={{ width: 80, height: 80 }}
                handleLike={async () => {
                  if (!track) return null;
                  const saveRes = await saveTracksToLibrary([track.id]);
                  if (saveRes) {
                    addToast({
                      variant: "success",
                      message: "Song added to library.",
                    });
                    return true;
                  }
                  return null;
                }}
                handleDislike={async () => {
                  if (!track) return null;
                  const removeRes = await removeTracksFromLibrary([track.id]);
                  if (removeRes) {
                    addToast({
                      variant: "success",
                      message: "Song removed from library.",
                    });
                    return true;
                  }
                  return null;
                }}
              />
            </div>
          </div>
          {lyrics ? (
            <div className="lyrics-container">
              <Heading number={3} as="h2">
                Letra
              </Heading>
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
                <Heading number={3} as="h2">
                  {track?.artists[0].name ?? ""}
                </Heading>
              </div>
              {artistTopTracks?.map((artistTrack, i) => {
                const maxToShow = showMoreTopTracks ? 10 : 5;
                if (i >= maxToShow) {
                  return null;
                }
                const isTheSameAsTrack = artistTrack.uri
                  ? artistTrack.uri === track?.uri
                  : false;
                const mainTrackExistInArtistTopTracks = sameTrackIndex >= 0;
                const isValidPosition = i - sameTrackIndex > 0;
                const mainTrackIsFirstPosition = isTheSameAsTrack && i === 0;
                const position =
                  mainTrackExistInArtistTopTracks && isValidPosition
                    ? i
                    : isTheSameAsTrack || mainTrackIsFirstPosition
                    ? 0
                    : i + 1;

                return (
                  <CardTrack
                    accessToken={accessToken ?? ""}
                    isTrackInLibrary={false}
                    playlistUri=""
                    track={artistTrack}
                    key={artistTrack.id}
                    type="playlist"
                    position={position}
                    visualPosition={i + 1}
                    isSingleTrack
                  />
                );
              })}
              <button
                type="button"
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
      <style jsx>{`
        .topTracks-header {
          display: block;
          margin-bottom: 20px;
          width: 100%;
        }
        .topTracks-header span {
          display: block;
          color: rgb(179, 179, 179);
        }
        .info :global(button) {
          margin-left: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: transparent;
          border: none;
        }
        .info :global(button:focus),
        .info :global(button:hover) {
          transform: scale(1.06);
        }
        .info :global(button:active) {
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
    </ContentContainer>
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
    const lyricsResponse = await within(
      getLyrics(track.artists[0].name, track.name),
      6000
    );
    if (lyricsResponse.data) {
      lyrics = lyricsResponse.data;
    }
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
