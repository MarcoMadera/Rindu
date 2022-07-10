import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import useAuth from "hooks/useAuth";
import useAnalitycs from "hooks/useAnalytics";
import { useEffect, useState, ReactElement } from "react";
import { serverRedirect } from "utils/serverRedirect";
import { getAuth } from "utils/getAuth";
import { getArtistById } from "utils/spotifyCalls/getArtistById";
import useHeader from "hooks/useHeader";
import { getArtistTopTracks } from "utils/spotifyCalls/getArtistTopTracks";
import CardTrack from "components/CardTrack";
import useSpotify from "hooks/useSpotify";
import PlaylistTopBarExtraField from "components/PlaylistTopBarExtraField";
import {
  getArtistAlbums,
  Include_groups,
} from "utils/spotifyCalls/getArtistAlbums";
import PresentationCard from "components/PresentationCard";
import { getRelatedArtists } from "utils/spotifyCalls/getRelatedArtists";
import { PlayButton } from "components/PlayButton";
import { follow, Follow_type } from "utils/spotifyCalls/follow";
import { unFollow } from "utils/spotifyCalls/unFollow";
import { checkIfUserFollowArtistUser } from "utils/spotifyCalls/checkIfUserFollowArtistUser";
import PageHeader from "../../components/PageHeader";
import { HeaderType } from "types/pageHeader";
import { MONTHS, SITE_URL } from "utils/constants";
import Carousel from "components/Carousel";
import SubTitle from "components/SubtTitle";
import { getSetLists, SetLists } from "utils/getSetLists";
import { ArtistsInfo, getArtistInfo } from "utils/getArtistInfo";
import { conjuction } from "utils/conjuction";
import { CardType } from "components/CardContent";

interface ArtistPageProps {
  currentArtist: SpotifyApi.SingleArtistResponse | null;
  topTracks: SpotifyApi.MultipleTracksResponse | null;
  singleAlbums: SpotifyApi.ArtistsAlbumsResponse | null;
  appearAlbums: SpotifyApi.ArtistsAlbumsResponse | null;
  relatedArtists: SpotifyApi.ArtistsRelatedArtistsResponse | null;
  accessToken?: string;
  user: SpotifyApi.UserObjectPrivate | null;
  setLists: SetLists | null;
  artistInfo: ArtistsInfo | null;
}

export default function ArtistPage({
  currentArtist,
  topTracks,
  singleAlbums,
  appearAlbums,
  relatedArtists,
  user,
  accessToken,
  setLists,
  artistInfo,
}: ArtistPageProps): ReactElement {
  const { setIsLogin, setUser, setAccessToken } = useAuth();
  const { trackWithGoogleAnalitycs } = useAnalitycs();
  const banner =
    artistInfo?.artists?.[0]?.strArtistFanart ||
    artistInfo?.artists?.[0]?.strArtistFanart2 ||
    artistInfo?.artists?.[0]?.strArtistFanart3 ||
    artistInfo?.artists?.[0]?.strArtistFanart4;
  const { setElement } = useHeader({
    alwaysDisplayColor: false,
    disableOpacityChange: !!banner,
    showOnFixed: false,
  });
  const router = useRouter();
  const { setPageDetails, setAllTracks } = useSpotify();
  const [showMoreTopTracks, setShowMoreTopTracks] = useState(false);
  const [isFollowingThisArtist, setIsFollowingThisArtist] = useState(false);
  const [showMoreAbout, setShowMoreAbout] = useState(false);

  useEffect(() => {
    if (!currentArtist) {
      router.push("/");
    }
    trackWithGoogleAnalitycs();

    setIsLogin(true);

    setAccessToken(accessToken);

    setUser(user);
  }, [
    accessToken,
    currentArtist,
    router,
    setAccessToken,
    setIsLogin,
    setUser,
    trackWithGoogleAnalitycs,
    user,
  ]);

  useEffect(() => {
    checkIfUserFollowArtistUser(
      Follow_type.artist,
      currentArtist?.id,
      accessToken
    ).then((res) => {
      setIsFollowingThisArtist(res);
    });
  }, [accessToken, currentArtist?.id, router]);

  useEffect(() => {
    setElement(() => <PlaylistTopBarExtraField uri={currentArtist?.uri} />);
    const user: SpotifyApi.UserObjectPublic = {
      display_name: currentArtist?.name,
      id: currentArtist?.id ?? "",
      images: currentArtist?.images,
      external_urls: { spotify: currentArtist?.external_urls.spotify ?? "" },
      href: "",
      uri: "",
      type: "user",
    };

    const items =
      topTracks?.tracks.map((track) => ({
        ...track,
        added_at: "",
        added_by: user,
        track: track,
        is_local: false,
      })) ?? [];

    setPageDetails({
      name: currentArtist?.name,
      uri: currentArtist?.uri,
      followers: { total: currentArtist?.followers?.total },
      description: currentArtist?.name,
      id: currentArtist?.id,
      tracks: { total: 10 },
      owner: user,
      type: "artist",
    });
    setAllTracks(
      items.map((track) => ({
        ...track,
        audio: track.preview_url,
        type: "track",
      }))
    );
  }, [
    topTracks,
    setElement,
    setPageDetails,
    router,
    setAllTracks,
    currentArtist?.name,
    currentArtist?.id,
    currentArtist?.images,
    currentArtist?.external_urls.spotify,
    currentArtist?.uri,
    currentArtist?.followers?.total,
  ]);

  return (
    <main>
      <PageHeader
        type={HeaderType.artist}
        title={currentArtist?.name ?? ""}
        coverImg={
          currentArtist?.images?.[0]?.url ??
          currentArtist?.images?.[1]?.url ??
          `${SITE_URL}/defaultSongCover.jpeg`
        }
        totalFollowers={currentArtist?.followers?.total ?? 0}
        popularity={currentArtist?.popularity ?? 0}
        banner={banner ?? ""}
        disableOpacityChange={!!banner}
      />
      <div className="options">
        <PlayButton uri={currentArtist?.uri} size={56} centerSize={28} />
        <div className="info button-inof">
          <button
            type="button"
            className="follow-button"
            onClick={() => {
              if (isFollowingThisArtist) {
                unFollow(
                  Follow_type.artist,
                  currentArtist?.id,
                  accessToken
                ).then((res) => {
                  if (res) {
                    setIsFollowingThisArtist(false);
                  }
                });
              } else {
                follow(Follow_type.artist, currentArtist?.id, accessToken).then(
                  (res) => {
                    if (res) {
                      setIsFollowingThisArtist(true);
                    }
                  }
                );
              }
            }}
          >
            {isFollowingThisArtist ? "Siguiendo" : "Seguir"}
          </button>
        </div>
      </div>
      <div className="content">
        {topTracks?.tracks && topTracks?.tracks?.length > 0 ? (
          <h3>Popular</h3>
        ) : null}
        <div className="popular-content">
          <div className="topTracks">
            <div>
              {topTracks?.tracks &&
                topTracks?.tracks?.map((track, i) => {
                  const maxToShow = showMoreTopTracks ? 10 : 5;
                  if (i >= maxToShow) {
                    return null;
                  }
                  return (
                    <CardTrack
                      accessToken={accessToken ?? ""}
                      isTrackInLibrary={false}
                      playlistUri=""
                      track={track}
                      key={track.id}
                      isSingleTrack
                      position={i}
                      type="playlist"
                    />
                  );
                })}
            </div>
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
          {setLists?.setlist && setLists?.setlist?.length > 0 ? (
            <div className="set-list">
              <div className="set-list-content">
                <h3>Concerts</h3>
                {setLists?.setlist?.map((set, i) => {
                  if (i > 4) return null;
                  const date = set.eventDate.split("-");

                  const year = date[2];
                  const month = date[1];
                  const day = date[0];

                  return (
                    <div key={set.id} className="set">
                      <div className="set-date">
                        <span className="month">
                          {MONTHS[Number(month) - 1]}
                        </span>
                        <span className="day">{day}</span>
                        <span className="year">{year}</span>
                      </div>
                      <div className="set-info">
                        <h4>{set.venue?.name}</h4>
                        <span>
                          {conjuction([
                            set.venue?.city.name,
                            set.venue?.city.state,
                            set.venue?.city.country.code,
                          ])}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
        {singleAlbums && singleAlbums?.items?.length > 0 ? (
          <Carousel title={"Albums"} gap={24}>
            {singleAlbums?.items?.map(
              ({ images, name, id, artists, release_date, album_type }) => {
                return (
                  <PresentationCard
                    type={CardType.ALBUM}
                    key={id}
                    images={images}
                    title={name}
                    subTitle={
                      <SubTitle
                        artists={artists}
                        albumType={album_type}
                        releaseYear={release_date}
                      />
                    }
                    id={id}
                  />
                );
              }
            )}
          </Carousel>
        ) : null}
        {appearAlbums && appearAlbums?.items?.length > 0 ? (
          <Carousel title={"Aparece en"} gap={24}>
            {appearAlbums?.items?.map(
              ({ images, name, id, artists, release_date, album_type }) => {
                return (
                  <PresentationCard
                    type={CardType.ALBUM}
                    key={id}
                    images={images}
                    title={name}
                    subTitle={
                      <SubTitle
                        artists={artists}
                        albumType={album_type}
                        releaseYear={release_date}
                      />
                    }
                    id={id}
                  />
                );
              }
            )}
          </Carousel>
        ) : null}
        {relatedArtists && relatedArtists?.artists?.length > 0 ? (
          <Carousel title={"Te pueden gustar"} gap={24}>
            {relatedArtists?.artists?.map(({ images, name, id }) => {
              return (
                <PresentationCard
                  type={CardType.ARTIST}
                  key={id}
                  images={images}
                  title={name}
                  subTitle={"Artist"}
                  id={id}
                />
              );
            })}
          </Carousel>
        ) : null}
        {artistInfo?.artists?.[0]?.strBiographyEN && (
          <section className="about">
            <div>
              <h2>About</h2>
              {showMoreAbout ? (
                <p>{artistInfo?.artists?.[0]?.strBiographyEN}</p>
              ) : (
                <p>
                  {artistInfo?.artists?.[0]?.strBiographyEN.slice(0, 2000)}
                  {artistInfo?.artists?.[0]?.strBiographyEN.length > 2000
                    ? "..."
                    : ""}
                </p>
              )}
              {artistInfo?.artists?.[0]?.strBiographyEN.length > 2000 ? (
                <button
                  type="button"
                  className="read-more"
                  onClick={() => {
                    setShowMoreAbout((prev) => !prev);
                  }}
                >
                  {showMoreAbout ? "Leer menos" : "Leer más"}
                </button>
              ) : null}
            </div>
            <div className="artist-about-img-container">
              {artistInfo?.artists?.[0]?.strArtistThumb && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="artist-about-img"
                  src={artistInfo?.artists?.[0]?.strArtistThumb}
                  alt={currentArtist?.name}
                />
              )}
            </div>
          </section>
        )}
        {setLists ? (
          <div className="attribution">
            <p>
              Concert setlists on{" "}
              <a
                href="https://www.setlist.fm/"
                target="_blank"
                rel="noreferrer noopener"
              >
                setlist.fm
              </a>
            </p>
          </div>
        ) : null}
      </div>
      <style jsx>{`
        main {
          display: block;
          margin: -60px auto 0 auto;
          height: calc(100vh - 90px);
          width: calc(100vw - 245px);
        }
        .attribution {
          margin-top: 16px;
          padding-bottom: 24px;
        }
        .attribution p {
          font-size: 0.6875rem;
          line-height: 1rem;
          text-transform: none;
          letter-spacing: normal;
          font-weight: 400;
          color: #b3b3b3;
          margin: 0;
        }
        a {
          color: #b3b3b3;
        }
        h3 {
          z-index: 999999;
          position: relative;
        }
        .set {
          display: flex;
          margin: 10px 0;
        }
        .set-info {
          margin-left: 18px;
        }
        .set-info h4 {
          margin: 0;
          font-size: 16px;
        }
        .set-info span {
          margin: 0;
          font-size: 14px;
        }
        .set-list {
          margin-left: 20px;
          flex: 40%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .month {
          text-align: left;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 12px;
        }
        .day {
          font-weight: normal;
          color: inherit;
          text-transform: none;
          text-align: left;
          font-size: 24px;
        }
        .year {
          font-weight: normal;
          color: inherit;
          text-transform: none;
          text-align: left;
          font-size: 12px;
        }
        .set-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1;
          font-size: 16px;
          width: fit-content;
        }
        .content .read-more {
          margin-top: 16px;
          padding: 0;
        }
        .popular-content {
          display: ${setLists ? "flex" : "block"};
        }
        .about {
          display: grid;
          grid-template-columns: minmax(180px, 700px) minmax(180px, 1fr);
        }
        .artist-about-img-container {
          display: flex;
          justify-content: center;
        }
        .artist-about-img {
          width: 100%;
          margin-top: 50px;
          max-width: 400px;
          height: fit-content;
          border-radius: 10px;
          max-height: 400px;
          aspect-ratio: 1;
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
          box-sizing: border-box;
          font-family: "Lato", sans-serif;
          margin: 0px;
          font-weight: 400;
          color: #9e9e9e;
          max-width: 672px;
          padding-top: 16px;
          padding-right: 20px;
        }
        .content button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          padding: 18px;
          font-weight: bold;
        }
        button.show-more:hover,
        button:hover {
          color: white;
        }
        div.info {
          align-self: flex-end;
          width: calc(100% - 310px);
        }
        .info.button-inof {
          align-self: center;
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
          min-height: 20px;
          max-height: min-content;
        }
        .info .follow-button {
          height: min-content;
        }
        .info button:focus,
        .info button:hover {
          border-color: #fff;
        }
        .info button:active {
          border-color: #fff;
        }
        .options {
          display: flex;
          padding: 24px 0;
          position: relative;
          width: 100%;
          align-items: center;
          margin: 16px 0;
          flex-direction: row;
          z-index: 999999;
          position: relative;
        }
        .options,
        .trc {
          padding: 0 32px;
        }
        .info button {
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
        }
        .content {
          padding: 32px;
          padding-bottom: 30px;
          position: relative;
          background-color: ${banner ? "#121212" : "transparent"};
        }
        .topTracks {
          display: flex;
          flex-wrap: wrap;
          margin-top: 32px;
          z-index: ${banner ? "999999" : "0"};
          position: relative;
          flex: 60%;
          height: fit-content;
        }
        @media (max-width: 1000px) {
          main {
            width: 100vw;
          }
        }
        @media (max-width: 500px) {
          .popular-content,
          .about {
            display: block;
          }
        }
      `}</style>
    </main>
  );
}

export async function getServerSideProps({
  params: { artistId },
  req,
  res,
}: {
  params: { artistId: string };
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  props: ArtistPageProps | null;
}> {
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  const currentArtist = await getArtistById(artistId, accessToken, cookies);
  const setListAPIKey = process.env.SETLIST_FM_API_KEY;
  const setListsProm = await getSetLists(currentArtist?.name, setListAPIKey);
  const artistInfoProm = await getArtistInfo(currentArtist?.name);

  const topTracksProm = await getArtistTopTracks(
    artistId,
    user?.country ?? "US",
    accessToken,
    cookies
  );
  const singleAlbumsProm = await getArtistAlbums(
    artistId,
    user?.country ?? "US",
    Include_groups.single,
    accessToken,
    cookies
  );
  const appearAlbumsProm = await getArtistAlbums(
    artistId,
    user?.country ?? "US",
    Include_groups.appears_on,
    accessToken,
    cookies
  );

  const relatedArtistsProm = await getRelatedArtists(
    artistId,
    accessToken,
    cookies
  );

  const [
    setLists,
    artistInfo,
    topTracks,
    singleAlbums,
    appearAlbums,
    relatedArtists,
  ] = await Promise.allSettled([
    setListsProm,
    artistInfoProm,
    topTracksProm,
    singleAlbumsProm,
    appearAlbumsProm,
    relatedArtistsProm,
  ]);

  return {
    props: {
      currentArtist,
      singleAlbums:
        singleAlbums.status === "fulfilled" ? singleAlbums.value : null,
      appearAlbums:
        appearAlbums.status === "fulfilled" ? appearAlbums.value : null,
      topTracks: topTracks.status === "fulfilled" ? topTracks.value : null,
      relatedArtists:
        relatedArtists.status === "fulfilled" ? relatedArtists.value : null,
      accessToken,
      user: user ?? null,
      setLists: setLists.status === "fulfilled" ? setLists.value : null,
      artistInfo: artistInfo.status === "fulfilled" ? artistInfo.value : null,
    },
  };
}
