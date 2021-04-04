import React from "react";
import { decode } from "html-entities";
import { usePalette } from "react-palette";
import useSpotify from "../../hooks/useSpotify";
import { getTracksFromPlayListRequest } from "../../lib/requests";
import {
  AllTracksFromAPlayList,
  AllTracksFromAPlaylistResponse,
} from "../../lib/types";

export interface PlaylistPageHeaderProps {
  playlistDetails: SpotifyApi.SinglePlaylistResponse;
  duplicatesSongs: number[];
  corruptedSongs: number;
  setAllTracks: React.Dispatch<React.SetStateAction<AllTracksFromAPlayList>>;
}

export const PlaylistPageHeader: React.FC<PlaylistPageHeaderProps> = ({
  playlistDetails,
  duplicatesSongs,
  corruptedSongs,
  setAllTracks,
}) => {
  const { data } = usePalette(
    playlistDetails?.images[0]
      ? playlistDetails?.images[0].url
      : playlistDetails?.images[1]?.url
  );
  const { removeTracks } = useSpotify();
  return (
    <header>
      <section>
        <img
          src={
            playlistDetails.images[1]
              ? playlistDetails.images[1].url
              : playlistDetails.images[0].url
          }
          alt=""
        />
        <div>
          <h1>{playlistDetails.name}</h1>
          <p>{decode(playlistDetails.description)}</p>
          <p>{decode(playlistDetails.owner.display_name)}</p>
          <p>{playlistDetails.followers.total} seguidores</p>
        </div>
      </section>
      <div>
        <p>{playlistDetails.tracks.total} Tracks</p>
        <p className="duplicateSongs">{`${
          duplicatesSongs.length - corruptedSongs
        } ${
          duplicatesSongs.length === 1
            ? "canción duplicada"
            : "canciones duplicadas"
        }`}</p>
        <p className="corruptedSongs">
          {`${corruptedSongs} ${
            corruptedSongs === 1 ? "canción corrupta" : "canciones corruptas"
          }`}
        </p>
        {corruptedSongs > 0 || duplicatesSongs.length > 0 ? (
          <button
            onClick={async () => {
              const snapshot = await removeTracks(
                playlistDetails.id,
                duplicatesSongs,
                playlistDetails.snapshot_id
              );
              if (snapshot) {
                const playListTracksres = await getTracksFromPlayListRequest(
                  playlistDetails.id
                );
                const playListTracks: AllTracksFromAPlaylistResponse = await playListTracksres.json();
                setAllTracks(playListTracks.tracks);
              }
            }}
          >
            Remover
          </button>
        ) : null}
      </div>
      <style jsx>
        {`
          .corruptedSongs {
            color: ${corruptedSongs > 0 ? "#c62828" : "#65c628"};
          }
          .duplicateSongs {
            color: ${duplicatesSongs.length > 0 ? "#c62828" : "#65c628"};
          }
          button {
            border: none;
            border-radius: 4px;
            background-color: #e83636;
            cursor: pointer;
            padding: 4px 6px;
            color: #fff;
          }
          p {
            margin: 0;
            color: #535296;
          }
          section {
            display: flex;
          }
          h1 {
            font-size: 24px;
            color: #abac73;
            margin-bottom: 0;
          }
          img {
            height: 100px;
            margin-right: 15px;
            align-self: center;
          }
          header {
            background: #fff;
            max-height: 110px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px;
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
    </header>
  );
};
