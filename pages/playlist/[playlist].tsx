import { NextApiRequest, NextApiResponse, NextPage } from "next";
import {
  getSinglePlayListRequest,
  getTracksFromPlayListRequest,
  refreshAccessTokenRequest,
} from "../../lib/requests";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ModalCardTrack from "../../components/forPlaylistsPage/CardTrack";
import {
  AllTracksFromAPlayList,
  AllTracksFromAPlaylistResponse,
  SpotifyUserResponse,
} from "types/spotify";
import { PlaylistPageHeader } from "../../components/forPlaylistsPage/PlaylistPageHeader";
import { ACCESSTOKENCOOKIE, REFRESHTOKENCOOKIE } from "../../utils/constants";
import { takeCookie } from "../../utils/cookies";
import { validateAccessToken } from "../../utils/validateAccessToken";
import Router from "next/router";
import useAnalitycs from "../../hooks/useAnalytics";
import useAuth from "hooks/useAuth";
import { findDuplicateSongs } from "utils/findDuplicateSongs";
import Head from "next/head";

interface PlaylistProps {
  playlistDetails: SpotifyApi.SinglePlaylistResponse;
  playListTracks: AllTracksFromAPlaylistResponse;
  accessToken?: string;
  user: SpotifyUserResponse | null;
}

const Playlist: NextPage<PlaylistProps> = ({
  playlistDetails,
  playListTracks,
  accessToken,
  user,
}) => {
  const { tracks } = playListTracks;
  const router = useRouter();
  const [duplicatesSongs, setDuplicatesSongs] = useState<number[]>([]);
  const [corruptedSongs, setCorruptedSongs] = useState<number>(0);
  const [allTracks, setAllTracks] = useState<AllTracksFromAPlayList>(tracks);
  const { setIsLogin, setUser } = useAuth();
  const { trackWithGoogleAnalitycs } = useAnalitycs();

  useEffect(() => {
    trackWithGoogleAnalitycs();
  }, [trackWithGoogleAnalitycs]);

  useEffect(() => {
    if (!playlistDetails) {
      router.push("/");
    }
    setAllTracks(tracks);

    setIsLogin(true);

    setUser(user);
  }, [router, playlistDetails, accessToken, setIsLogin, setUser, user, tracks]);

  useEffect(() => {
    if (!(allTracks?.length > 0)) {
      return;
    }

    setDuplicatesSongs(findDuplicateSongs(allTracks));

    setCorruptedSongs(() => {
      const corrupted = allTracks.filter(
        ({ corruptedTrack }) => corruptedTrack
      );
      return corrupted.length;
    });
  }, [allTracks]);

  return (
    <main>
      <Head>
        <title>{`Rindu: ${playlistDetails.name}`}</title>
      </Head>
      <section>
        <PlaylistPageHeader
          playlistDetails={playlistDetails}
          duplicatesSongs={duplicatesSongs}
          corruptedSongs={corruptedSongs}
          setAllTracks={setAllTracks}
        />
        <div>
          {allTracks?.length > 0
            ? allTracks?.map((track) => {
                if (track.corruptedTrack) {
                  return null;
                }
                return (
                  <ModalCardTrack
                    accessToken={accessToken}
                    key={track.position}
                    track={track}
                    playlistUri={playlistDetails.uri}
                  />
                );
              })
            : null}
        </div>
      </section>
      <style jsx>{`
        main {
          display: block;
          margin: -60px auto 0 auto;
          height: calc(100vh - 90px);
          overflow-y: scroll;
          width: calc(100vw - 200px);
        }
        div {
          padding: 0 32px;
        }
        section {
          display: flex;
          flex-direction: column;
          margin: 0 auto;
          padding: 0;
        }
      `}</style>
    </main>
  );
};

export default Playlist;

export async function getServerSideProps({
  params: { playlist },
  req,
  res,
}: {
  params: { playlist: string };
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  props: {
    playlistDetails: PlaylistProps;
    user?: SpotifyUserResponse | null;
    playListTracks: AllTracksFromAPlaylistResponse;
    accessToken?: string;
  };
}> {
  const cookies = req ? req?.headers?.cookie : undefined;
  const refreshToken = takeCookie(REFRESHTOKENCOOKIE, cookies);
  let accessToken = takeCookie(ACCESSTOKENCOOKIE, cookies);
  const user = await validateAccessToken(accessToken);

  try {
    if (refreshToken && !user) {
      const re = await refreshAccessTokenRequest(refreshToken);
      if (!re.ok) {
        res.writeHead(307, { Location: "/" });
        res.end();
      }
      const refresh = await re.json();
      accessToken = refresh.accessToken;
    } else {
      accessToken = cookies
        ? takeCookie(ACCESSTOKENCOOKIE, cookies)
        : undefined;
    }

    if (!cookies) {
      res.writeHead(307, { Location: "/" });
      res.end();
    }
  } catch (error) {
    console.log(error);
  }

  const _res = await getSinglePlayListRequest(playlist, cookies);
  const playlistDetails = await _res.json();
  const playListTracksres = await getTracksFromPlayListRequest(
    playlist,
    cookies
  );

  if (!user) {
    if (res) {
      res.writeHead(307, { Location: "/" });
      res.end();
    } else {
      Router.replace("/");
    }
  }

  const playListTracks = await playListTracksres.json();
  return {
    props: { playlistDetails, playListTracks, accessToken, user },
  };
}
