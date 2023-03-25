import { ReactElement, useLayoutEffect, useRef, useState } from "react";

import Link from "next/link";

import EmbedModal from "./EmbedModal";
import { useAuth, useContextMenu, useSpotify, useToast } from "hooks";
import { menuContextStyles } from "styles/menuContextStyles";
import { ITrack } from "types/spotify";
import { getSiteUrl, positionSubMenu } from "utils";
import {
  addItemsToPlaylist,
  addToQueue,
  saveEpisodesToLibrary,
  saveTracksToLibrary,
} from "utils/spotifyCalls";

export interface ICardTrackContextMenu {
  track: ITrack;
}

export default function CardTrackContextMenu({
  track,
}: ICardTrackContextMenu): ReactElement {
  const { addToast } = useToast();
  const { deviceId, playlists } = useSpotify();
  const { accessToken } = useAuth();
  const { removeContextMenu, setModalData } = useContextMenu();

  const availableStations = ["track", "artist", "genre"];
  const type = track?.type ?? "track";
  const isStationAvailable = availableStations.includes(type);

  const playlistsRef = useRef<HTMLDivElement>(null);
  const [showAddPlaylistPopup, setShowAddPlaylistPopup] =
    useState<boolean>(false);
  const { user } = useAuth();
  const userPlaylists = playlists.filter(
    (playlist) => playlist.owner.id === user?.id
  );
  const containerRef = useRef<HTMLUListElement>(null);
  const addToPlaylistOptionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!showAddPlaylistPopup) return;
    const menuContainer = containerRef.current;
    const subMenuContainer = playlistsRef.current;
    const hoveredItem = addToPlaylistOptionRef.current;
    const items = userPlaylists.length;

    if (subMenuContainer && menuContainer && hoveredItem) {
      positionSubMenu(subMenuContainer, menuContainer, items, hoveredItem);
    }
  }, [showAddPlaylistPopup, userPlaylists.length]);

  return (
    <ul ref={containerRef}>
      {track?.uri && deviceId && (
        <li>
          <button
            type="button"
            onClick={() => {
              if (track?.uri && deviceId) {
                addToQueue(track.uri, deviceId, accessToken).then((res) => {
                  if (res) {
                    addToast({
                      variant: "success",
                      message: "Added to queue",
                    });
                  } else {
                    addToast({
                      variant: "error",
                      message: "Could not add to queue",
                    });
                  }
                  removeContextMenu();
                });
              }
            }}
          >
            Add to queue
          </button>
        </li>
      )}
      <li>
        {userPlaylists.length > 0 && (
          <div
            onMouseEnter={() => {
              setShowAddPlaylistPopup(true);
            }}
            onMouseLeave={() => {
              setShowAddPlaylistPopup(false);
            }}
            role="button"
            tabIndex={0}
            ref={addToPlaylistOptionRef}
          >
            Add to playlist
          </div>
        )}
        {showAddPlaylistPopup && (
          <div
            ref={playlistsRef}
            className="playlists-container"
            onMouseEnter={() => {
              setShowAddPlaylistPopup(true);
            }}
            onMouseLeave={() => {
              setShowAddPlaylistPopup(false);
            }}
          >
            <ul>
              {userPlaylists?.map((playlist) => {
                return (
                  <li key={playlist.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (track?.uri && deviceId) {
                          addItemsToPlaylist(playlist.id, [track.uri]).then(
                            (res) => {
                              if (res) {
                                addToast({
                                  variant: "success",
                                  message: "Added to playlist",
                                });
                              } else {
                                addToast({
                                  variant: "error",
                                  message: "Could not add to playlist",
                                });
                              }
                              setShowAddPlaylistPopup(false);
                              removeContextMenu();
                            }
                          );
                        }
                      }}
                    >
                      {playlist.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </li>
      {isStationAvailable && (
        <li>
          <Link
            href={`${getSiteUrl()}/station/${track.type ?? "track"}/${
              track?.id || ""
            }`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                removeContextMenu();
              }
            }}
            role="link"
            onClick={() => {
              removeContextMenu();
            }}
          >
            Go to {type} Radio
          </Link>
        </li>
      )}
      {track?.artists && track.artists?.length > 0 && track.artists?.[0].id && (
        <li>
          <Link
            href={`/artist/${track.artists[0].id}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                removeContextMenu();
              }
            }}
            role="link"
            onClick={() => {
              removeContextMenu();
            }}
          >
            Go to artist
          </Link>
        </li>
      )}
      {track?.album?.id && (
        <li>
          <Link
            href={`/${track?.album?.type ?? "album"}/${track?.album?.id}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                removeContextMenu();
              }
            }}
            role="link"
            onClick={() => {
              removeContextMenu();
            }}
          >
            Go to {track?.album?.type ?? "album"}
          </Link>
        </li>
      )}
      <li>
        <button
          onClick={() => {
            if (!track.type || !track.id) return;
            setModalData({
              title: "Embed",
              modalElement: <EmbedModal type={track.type} id={track.id} />,
              maxHeight: "100%",
            });
            removeContextMenu();
          }}
        >
          Embed {track.type}
        </button>
      </li>
      {track && deviceId && (
        <li>
          <button
            type="button"
            onClick={() => {
              const saveToLibrary =
                track.type === "episode"
                  ? saveEpisodesToLibrary
                  : saveTracksToLibrary;
              saveToLibrary([track.id ?? ""], accessToken).then((res) => {
                if (res) {
                  addToast({
                    variant: "success",
                    message: `${
                      track.type === "episode" ? "Episode" : "Song"
                    } added to library`,
                  });
                } else {
                  addToast({
                    variant: "error",
                    message: "Could not add to library",
                  });
                }
                removeContextMenu();
              });
            }}
          >
            Save to Your {track.type === "episode" ? "Episodes" : "Liked songs"}
          </button>
        </li>
      )}
      {track?.uri && (
        <li>
          <a href={track.uri} target="_blank" rel="noopener noreferrer">
            Open in Spotify App
          </a>
        </li>
      )}
      <style jsx>{`
        .playlists-container {
          position: absolute;
          top: 0;
          left: 98%;
          padding: 6px 2px;
          border-radius: 5px;
          background-color: #282828;
          max-width: 200px;
          overflow: auto;
        }
      `}</style>
      <style jsx>{menuContextStyles}</style>
    </ul>
  );
}
