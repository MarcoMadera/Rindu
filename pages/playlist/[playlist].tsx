import { NextApiRequest, NextPage } from "next";
import {
  getSinglePlayListRequest,
  getTracksFromPlayListRequest,
} from "../../lib/requests";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import ModalCardTrack from "../../components/forPlaylistsPage/CardTrack";
import { decode } from "html-entities";
import { usePalette } from "react-palette";
import { AllTracksFromAPlayList } from "../../lib/types";

interface PlaylistProps {
  playlistDetails: SpotifyApi.SinglePlaylistResponse;
}

const PlaylistPageHeader: React.FC<PlaylistProps> = ({ playlistDetails }) => {
  const { data } = usePalette(playlistDetails.images[0].url);

  return (
    <div>
      <img
        src={
          playlistDetails.images[1]
            ? playlistDetails.images[1].url
            : playlistDetails.images[0].url
        }
        alt=""
      />
      <section>
        <h1>{playlistDetails.name}</h1>
        <p>{decode(playlistDetails.description)}</p>
        <p>{decode(playlistDetails.owner.display_name)}</p>
        <p>{playlistDetails.followers.total} seguidores</p>
      </section>
      <style jsx>
        {`
          p {
            margin: 0;
            color: #535296;
          }
          h1 {
            font-size: 24px;
            color: #abac73;
            margin-bottom: 0;
          }
          img {
            height: 100px;
            margin: 5px;
            margin-right: 20px;
            align-self: center;
          }
          div {
            background: #fff;
            max-height: 110px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            max-width: 800px;
          }
          :global(body) {
            background-image: linear-gradient(
              180deg,
              ${data.darkMuted},
              ${data.darkVibrant} 90%
            );
          }
        `}
      </style>
    </div>
  );
};

const Playlist: NextPage<PlaylistProps> = ({ playlistDetails }) => {
  const { tracks } = playlistDetails;
  console.log(playlistDetails);
  const router = useRouter();
  useEffect(() => {
    if (!playlistDetails) {
      router.push("/");
    }
  }, [router, playlistDetails]);
  return (
    <main>
      <section>
        <PlaylistPageHeader playlistDetails={playlistDetails} />
        <div>
          {tracks?.items.length > 0
            ? tracks.items.map(({ track }) => {
                return <ModalCardTrack key={track.id} track={track} />;
              })
            : null}
        </div>
      </section>
      <style jsx>{`
        main {
          min-height: calc(100vh - 80px - 30px);
          display: flex;
          justify-content: center;
        }
        section {
          display: flex;
          flex-direction: column;
          max-width: 800px;
          margin: 0;
          padding: 0;
        }
        div {
          max-height: calc(100vh - 240px);
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
}): Promise<{ props: PlaylistProps & AllTracksFromAPlayList }> {
  const cookies = req ? req?.headers?.cookie : undefined;
  const _res = await getSinglePlayListRequest(playlist, cookies);
  const alltracksres = await getTracksFromPlayListRequest(playlist, cookies);
  const alltracks = await alltracksres.json();
  const playlistDetails = await _res.json();
  return {
    props: { playlistDetails, alltracks },
  };
}
