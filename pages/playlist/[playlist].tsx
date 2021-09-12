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
  const { setIsLogin, setUser, setAccessToken } = useAuth();
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

    setAccessToken(accessToken);
  }, [
    router,
    playlistDetails,
    accessToken,
    setAccessToken,
    setIsLogin,
    setUser,
    user,
    tracks,
  ]);

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
          margin: 0 auto;
          padding: 0 20px;
          height: calc(100vh - 90px);
          overflow-y: scroll;
          width: calc(100vw - 200px);
        }
        section {
          display: flex;
          flex-direction: column;
          max-width: 800px;
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
  let accessToken;
  try {
    if (refreshToken) {
      const re = await refreshAccessTokenRequest(refreshToken);
      const refresh = await re.json();
      accessToken = refresh.accessToken;

      res.setHeader("Set-Cookie", [
        `${ACCESSTOKENCOOKIE}=${accessToken}; Path=/;"`,
      ]);
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
  const user = await validateAccessToken(accessToken);
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
