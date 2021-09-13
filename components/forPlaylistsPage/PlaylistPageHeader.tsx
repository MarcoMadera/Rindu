import React from "react";
import { decode } from "html-entities";
import useSpotify from "../../hooks/useSpotify";
import { getTracksFromPlayListRequest } from "../../lib/requests";
import {
  AllTracksFromAPlayList,
  AllTracksFromAPlaylistResponse,
} from "types/spotify";
import { SITE_URL } from "../../utils/constants";
import Link from "next/link";

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
  const { removeTracks } = useSpotify();
  const coverImg =
    playlistDetails.images[0]?.url ??
    playlistDetails.images[1]?.url ??
    `${SITE_URL}/defaultSongCover.jpeg`;

  return (
    <header>
      <div className="background"></div>
      <div className="noise"></div>
      <section>
        <img src={coverImg} alt="" />
        <div className="playlistInfo">
          <h2>PLAYLIST</h2>
          <h1>{playlistDetails.name}</h1>
          <p>{decode(playlistDetails.description)}</p>
          <div>
            <p>
              <Link href={`/user/${playlistDetails.owner.id}`}>
                <a className="userLink">
                  {decode(playlistDetails.owner.display_name)}
                </a>
              </Link>{" "}
              {playlistDetails.followers.total > 0 ? (
                <span>
                  &middot; {playlistDetails.followers.total} seguidores{" "}
                </span>
              ) : null}
              <span>&middot; {playlistDetails.tracks.total} canciones</span>
              {duplicatesSongs.length > 0 ? (
                <span>, {duplicatesSongs.length} duplicadas</span>
              ) : null}
              {corruptedSongs > 0 ? (
                <span>, {corruptedSongs} corruptas</span>
              ) : null}
            </p>
          </div>
        </div>
        <div className="info">
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
                  const playListTracks: AllTracksFromAPlaylistResponse =
                    await playListTracksres.json();
                  setAllTracks(playListTracks.tracks);
                }
              }}
            >
              Remover
            </button>
          ) : null}
        </div>
      </section>
      <style jsx>
        {`
          h2 {
            font-size: 12px;
            margin-top: 4px;
            margin-bottom: 0;
            font-weight: 700;
          }
          div.playlistInfo {
            align-self: flex-end;
          }
          div.background,
          div.noise {
            display: block;
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
            z-index: -1;
          }
          div.background {
            background-color: #535353;
          }
          div.noise {
            background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%),
              url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=");
          }
          .corruptedSongs {
            color: ${corruptedSongs > 0 ? "#c62828" : "#65c628"};
          }
          .duplicateSongs {
            color: ${duplicatesSongs.length > 0 ? "#c62828" : "#65c628"};
          }
          .userLink {
            font-size: 14px;
            font-weight: 700;
            letter-spacing: normal;
            line-height: 16px;
            text-transform: none;
            color: #fff;
            text-decoration: none;
          }
          .userLink:hover,
          .userLink:focus {
            text-decoration: underline;
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
            color: #ffffffb3;
          }
          section {
            display: flex;
            height: 232px;
            min-width: 232px;
            width: 100%;
            margin-top: 60px;
          }
          h1 {
            color: #fff;
            margin: 0;
            padding: 0.08em 0px;
            font-size: 96px;
            line-height: 96px;
            visibility: visible;
            width: 100%;
            font-weight: 900;
            letter-spacing: -0.04em;
            text-transform: none;
          }
          img {
            margin-right: 15px;
            align-self: center;

            align-self: flex-end;
            height: 232px;
            margin-inline-end: 24px;
            min-width: 232px;
            width: 232px;
          }
          header {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            padding: 0 32px;
            height: 30vh;
            max-height: 500px;
            min-height: 340px;
            width: 100%;
            position: relative;
            z-index: 1;
          }
        `}
      </style>
    </header>
  );
};
