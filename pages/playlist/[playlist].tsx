import { AllTracksFromAPlaylistResponse } from "../../lib/types";
import { NextApiRequest, NextPage } from "next";
import { getTracksFromPlayListRequest } from "../../lib/requests";
import useSpotify from "../../hooks/useSpotify";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ModalCardTrack from "../../components/forPlaylistsPage/CardTrack";

const Playlist: NextPage<AllTracksFromAPlaylistResponse> = ({ tracks }) => {
  const router = useRouter();
  const { playlists } = useSpotify();
  useEffect(() => {
    if (!tracks) {
      router.push("/");
    }
  }, [router, tracks]);
  return (
    <main>
      <p>{playlists?.length > 0 ? playlists[0]?.name : null}</p>
      <div>
        {tracks?.length > 0
          ? tracks.map((track) => {
              return <ModalCardTrack key={track.position} track={track} />;
            })
          : null}
      </div>
      <style jsx>{`
        main {
          height: calc(100vh - 120px - 66px);
        }
        div {
          max-height: calc(100vh - 265px);
          overflow-y: auto;
        }
        div::-webkit-scrollbar {
          height: 8px;
          width: 8px;
          overflow: visible;
        }
        div::-webkit-scrollbar-thumb {
          background: #181818;
          border-radius: 30px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </main>
  );
};

export default Playlist;

export async function getServerSideProps({
  params: { playlist },
  req,
}: {
  params: { playlist: string };
  req: NextApiRequest;
}): Promise<{ props: AllTracksFromAPlaylistResponse }> {
  const cookies = req ? req?.headers?.cookie : undefined;
  const res = await getTracksFromPlayListRequest(playlist, cookies);
  const tracks: AllTracksFromAPlaylistResponse = await res.json();
  return {
    props: tracks,
  };
}
