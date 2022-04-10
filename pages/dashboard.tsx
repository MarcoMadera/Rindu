import { NextApiRequest, NextApiResponse, NextPage } from "next";
import React, { useEffect, useState } from "react";
import PresentationCard from "components/forDashboardPage/PlaylistCard";
import useAuth from "hooks/useAuth";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRE_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "../utils/constants";
import { decode } from "html-entities";
import { getAuth } from "utils/getAuth";
import { serverRedirect } from "utils/serverRedirect";
import { getAuthorizationByCode } from "utils/spotifyCalls/getAuthorizationByCode";
import useHeader from "hooks/useHeader";
import { useRouter } from "next/router";
import { getRecommendations } from "utils/spotifyCalls/getRecommendations";
import { getMyTopTracks } from "utils/spotifyCalls/getMyTopTracks";
import ModalCardTrack from "components/forPlaylistsPage/CardTrack";
import { getFeaturedPlaylists } from "utils/spotifyCalls/getFeaturedPlaylists";
import { getNewReleases } from "utils/spotifyCalls/getNewReleases";
import { getCategories } from "utils/spotifyCalls/getCategories";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";
import FirstTrackContainer from "components/FirstTrackContainer";

interface DashboardProps {
  user: SpotifyApi.UserObjectPrivate | null;
  accessToken: string | null;
  featuredPlaylists: SpotifyApi.ListOfFeaturedPlaylistsResponse | null;
  newReleases: SpotifyApi.ListOfNewReleasesResponse | null;
  categories: SpotifyApi.PagingObject<SpotifyApi.CategoryObject> | null;
}

const Dashboard: NextPage<DashboardProps> = ({
  user,
  accessToken,
  featuredPlaylists,
  newReleases,
  categories,
}) => {
  const { setIsLogin, setUser } = useAuth();
  const { setHeaderColor } = useHeader();
  const router = useRouter();
  const [tracksRecommendations, setTracksRecommendations] = useState<
    SpotifyApi.TrackObjectFull[] | null
  >([]);
  const [tracksInLibrary, setTracksInLibrary] = useState<boolean[] | null>([]);

  useEffect(() => {
    setIsLogin(true);

    setUser(user);
    getMyTopTracks(accessToken, 5).then((res) => {
      const seed_tracks = res?.items?.map((item) => item.id) ?? [];
      if (seed_tracks.length > 0) {
        getRecommendations(seed_tracks, accessToken)
          .then((res) => {
            setTracksRecommendations(res);
            return res;
          })
          .then((res) => {
            const tracks = res?.map((item) => item.id) ?? [];
            checkTracksInLibrary(tracks, accessToken ?? "").then(
              setTracksInLibrary
            );
          });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    setHeaderColor("#242424");
  }, [router, setHeaderColor]);

  return (
    <>
      <main>
        <header></header>
        {featuredPlaylists &&
        featuredPlaylists?.playlists?.items?.length > 0 ? (
          <>
            <h2>
              {featuredPlaylists.message ?? "Disfruta de estás playlists"}
            </h2>
            <section className="playlists">
              {featuredPlaylists.playlists?.items?.map(
                ({ images, name, description, id, owner }) => {
                  return (
                    <PresentationCard
                      type="playlist"
                      key={id}
                      images={images}
                      title={name}
                      subTitle={
                        decode(description) || `De ${owner.display_name}`
                      }
                      id={id}
                    />
                  );
                }
              )}
            </section>
          </>
        ) : null}
        {newReleases && newReleases.albums?.items?.length > 0 ? (
          <>
            <h2>{newReleases.message ?? "Lo más nuevo"}</h2>
            <section className="playlists">
              {newReleases.albums?.items?.map(
                ({ images, name, id, artists }) => {
                  const artistNames = artists.map((artist) => artist.name);
                  const subTitle = artistNames.join(", ");
                  return (
                    <PresentationCard
                      type="album"
                      key={id}
                      images={images}
                      title={name}
                      subTitle={subTitle}
                      id={id}
                    />
                  );
                }
              )}
            </section>
          </>
        ) : null}
        {tracksRecommendations && tracksRecommendations?.length > 0 && (
          <>
            <h2>Te van a gustar</h2>
            <section className="tracks">
              <FirstTrackContainer
                track={tracksRecommendations?.[0]}
                preview={tracksRecommendations?.[0].preview_url}
              />

              <div className="trackSearch">
                {tracksRecommendations?.map((track, i) => {
                  if (i === 0 || i > 4) {
                    return null;
                  }
                  return (
                    <ModalCardTrack
                      accessToken={accessToken ?? ""}
                      isTrackInLibrary={tracksInLibrary?.[i] ?? false}
                      playlistUri=""
                      track={{
                        ...track,
                        media_type: "audio",
                        audio: track.preview_url,
                        images: track.album.images,
                        duration: track.duration_ms,
                      }}
                      key={track.id}
                      type="presentation"
                    />
                  );
                })}
              </div>
            </section>
          </>
        )}
        <h2>Categorias</h2>
        <section className="playlists">
          {categories?.items.map(({ name, id, icons }) => {
            return (
              <PresentationCard
                type="genre"
                key={id}
                images={icons}
                title={name}
                subTitle={""}
                id={id}
              />
            );
          })}
        </section>
      </main>

      <style jsx>{`
        main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .tracks {
          display: grid;
          grid-template-columns: 49% 49%;
          width: 100%;
          grid-gap: 20px;
          margin: 10px 0 30px;
        }
        h1 {
          color: #fff;
          font-weight: bold;
          margin: 0;
        }
        section {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          grid-gap: 24px;
          margin: 20px 0 50px 0;
          justify-content: space-between;
        }
      `}</style>
    </>
  );
};
export default Dashboard;

export async function getServerSideProps({
  res,
  req,
  query,
}: {
  res: NextApiResponse;
  req: NextApiRequest;
  query: { code?: string };
}): Promise<{
  props: DashboardProps;
}> {
  const cookies = req?.headers?.cookie ?? "";

  if (query.code) {
    const tokens = await getAuthorizationByCode(query.code);
    if (!tokens) {
      serverRedirect(res, "/");
    }
    if (tokens) {
      res.setHeader("Set-Cookie", [
        `${ACCESS_TOKEN_COOKIE}=${tokens.accessToken}; Path=/;"`,
        `${REFRESH_TOKEN_COOKIE}=${tokens.refreshToken}; Path=/;"`,
        `${EXPIRE_TOKEN_COOKIE}=${tokens.expiresIn}; Path=/;"`,
      ]);
    }
  }

  const { accessToken, user } = (await getAuth(res, cookies)) || {};
  const featuredPlaylists = await getFeaturedPlaylists(
    user?.country ?? "US",
    5,
    accessToken,
    cookies
  );
  const newReleases = await getNewReleases(
    user?.country ?? "US",
    5,
    accessToken,
    cookies
  );

  const categories = await getCategories(
    user?.country ?? "US",
    5,
    accessToken,
    cookies
  );

  return {
    props: {
      user: user || null,
      accessToken: accessToken ?? null,
      featuredPlaylists,
      newReleases,
      categories,
    },
  };
}
