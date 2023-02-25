import { ReactElement, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import useContextMenu from "hooks/useContextMenu";
import useToast from "hooks/useToast";
import { addToQueue } from "utils/spotifyCalls/addToQueue";
import useSpotify from "hooks/useSpotify";
import useAuth from "hooks/useAuth";
import { saveEpisodesToLibrary } from "utils/spotifyCalls/saveEpisodesToLibrary";
import { saveTracksToLibrary } from "utils/spotifyCalls/saveTracksToLibrary";
import { addItemsToPlaylist } from "utils/spotifyCalls/addItemsToPlaylist";
import { getSiteUrl } from "utils/environment";
import { menuContextStyles } from "styles/menuContextStyles";
import { ITrack } from "types/spotify";

export interface ICardTrackContextMenu {
  track: ITrack;
}
export function CardTrackContextMenu({
  track,
}: ICardTrackContextMenu): ReactElement {
  const { addToast } = useToast();
  const { deviceId, playlists } = useSpotify();
  const { accessToken } = useAuth();
  const { removeContextMenu } = useContextMenu();

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
  const calculatedTopRef = useRef<number | undefined>();

  useLayoutEffect(() => {
    if (!showAddPlaylistPopup) return;
    const playlistsCount = userPlaylists.length;
    const playlistsContainerHeight = playlistsCount * 44;
    const playlistsContainer = playlistsRef.current;
    const screenHeight = window.innerHeight;

    if (playlistsContainer) {
      const playlistsRefPosition = playlistsContainer.getBoundingClientRect();
      calculatedTopRef.current = -(playlistsRefPosition.top - 50);
      if (playlistsContainerHeight > screenHeight) {
        playlistsContainer.style.height = `${screenHeight - 100}px`;
        if (calculatedTopRef.current) {
          playlistsContainer.style.top = `${calculatedTopRef.current}px`;
        }
      }
    }
  }, [userPlaylists, showAddPlaylistPopup, track]);

  return (
    <ul>
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
        <div
          onMouseEnter={() => {
            setShowAddPlaylistPopup(true);
          }}
          onMouseLeave={() => {
            setShowAddPlaylistPopup(false);
          }}
          role="button"
          tabIndex={0}
        >
          Add to playlist
        </div>
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
