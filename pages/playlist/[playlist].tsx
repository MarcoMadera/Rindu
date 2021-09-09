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
} from "types/spotify";
import { PlaylistPageHeader } from "../../components/forPlaylistsPage/PlaylistPageHeader";
import { ACCESSTOKENCOOKIE, REFRESHTOKENCOOKIE } from "../../utils/constants";
import { takeCookie } from "../../utils/cookies";
import { validateAccessToken } from "../../utils/validateAccessToken";
import Router from "next/router";
import useAnalitycs from "../../hooks/useAnalytics";

interface PlaylistProps {
  playlistDetails: SpotifyApi.SinglePlaylistResponse;
  playListTracks: AllTracksFromAPlaylistResponse;
}

const Playlist: NextPage<PlaylistProps> = ({
  playlistDetails,
  playListTracks,
}) => {
  const { tracks } = playListTracks;
  const router = useRouter();
  const [duplicatesSongs, setDuplicatesSongs] = useState<number[]>([]);
  const [corruptedSongs, setCorruptedSongs] = useState<number>(0);
  const [allTracks, setAllTracks] = useState<AllTracksFromAPlayList>(tracks);

  const { trackWithGoogleAnalitycs } = useAnalitycs();

  useEffect(() => {
    trackWithGoogleAnalitycs();
  }, [trackWithGoogleAnalitycs]);

  useEffect(() => {
    if (!playlistDetails) {
      router.push("/");
    }
  }, [router, playlistDetails]);

  useEffect(() => {
    setAllTracks(tracks);
  }, [tracks]);

  useEffect(() => {
    if (!(allTracks?.length > 0)) {
      return;
    }

    const sortedArraybyValue = allTracks.sort((a, b) => {
      if (a.corruptedTrack || b.corruptedTrack) {
        return 0;
      }
      if (a.uri && b.uri) {
        return a?.uri > b?.uri ? 1 : b?.uri > a?.uri ? -1 : 0;
      }
      return 0;
    });

    const duplicates = sortedArraybyValue
      .filter((track, i) => {
        if (track.corruptedTrack) {
          return true;
        }
        if (i === sortedArraybyValue.length - 1) {
          return false;
        }
        return track.uri === sortedArraybyValue[i + 1].uri;
      })
      .map(({ position }) => position);
    setDuplicatesSongs(duplicates);
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
                return <ModalCardTrack key={track.position} track={track} />;
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
    playListTracks: AllTracksFromAPlaylistResponse;
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
    const user = await validateAccessToken(accessToken);
    if (!user) {
      if (res) {
        res.writeHead(307, { Location: "/" });
        res.end();
      } else {
        Router.replace("/");
      }
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
  const playListTracks = await playListTracksres.json();
  return {
    props: { playlistDetails, playListTracks },
  };
}
