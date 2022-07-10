import { createPortal } from "react-dom";
import {
  Dispatch,
  ReactPortal,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import useSpotify from "hooks/useSpotify";
import useAuth from "hooks/useAuth";
import { ITrack } from "types/spotify";
import CardTrack from "./CardTrack";
import { takeCookie } from "utils/cookies";
import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { List } from "react-virtualized";
import { LoadingSpinner } from "./LoadingSpinner";
import useToast from "hooks/useToast";
import { analyzePlaylist } from "utils/analyzePlaylist";

interface RemoveTracksModalProps {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  isLibrary: boolean;
}

export default function RemoveTracksModal({
  openModal,
  setOpenModal,
  isLibrary,
}: RemoveTracksModalProps): ReactPortal | null {
  const [targetNode, setTargetNode] = useState<Element>();
  const firstButtonRef = useRef<HTMLButtonElement | null>(null);
  const secondButtonRef = useRef<HTMLButtonElement | null>(null);
  const { removeTracks, pageDetails, setAllTracks } = useSpotify();
  const { accessToken } = useAuth();
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const { addToast } = useToast();
  const [duplicateTracksIdx, setDuplicateTracksIdx] = useState<number[]>([]);
  const [corruptedSongsIdx, setCorruptedSongsIdx] = useState<number[]>([]);
  const [tracksToRemove, setTracksToRemove] = useState<ITrack[]>([]);

  useEffect(() => {
    if (!pageDetails || !accessToken) return;
    setIsLoadingComplete(false);

    analyzePlaylist(
      pageDetails?.id,
      pageDetails?.tracks?.total,
      isLibrary,
      accessToken
    ).then((res) => {
      if (!res) return;

      setAllTracks(res.tracks);
      setDuplicateTracksIdx(res.duplicateTracksIndexes);
      setCorruptedSongsIdx(res.corruptedSongsIndexes);
      setTracksToRemove(res.tracksToRemove);
      setIsLoadingComplete(true);
    });
  }, [accessToken, isLibrary, pageDetails, setAllTracks]);

  const onPressKey = useCallback(
    (event: KeyboardEvent) => {
      const firstElement = firstButtonRef.current;
      const lastElement = secondButtonRef.current;
      if (event.key === "Escape") {
        setOpenModal(false);
      }
      if (
        !event.shiftKey &&
        document.activeElement !== firstElement &&
        event.key !== "Enter"
      ) {
        firstElement?.focus();
        return event.preventDefault();
      }
      if (
        event.shiftKey &&
        event.key === "Tab" &&
        document.activeElement !== lastElement
      ) {
        lastElement?.focus();
        event.preventDefault();
      }
      return;
    },
    [setOpenModal]
  );

  useEffect(() => {
    setTargetNode(document.querySelector("#tracksModal") as Element);
    document.addEventListener("keydown", (e) => onPressKey(e), false);

    return () => {
      document.removeEventListener("keydown", onPressKey, false);
    };
  }, [onPressKey]);

  useLayoutEffect(() => {
    const elementToBlur = document.querySelector<HTMLElement>(".container");
    if (elementToBlur) {
      elementToBlur.style.filter = "blur(2.5px)";
    }

    return () => {
      if (elementToBlur) {
        elementToBlur.style.filter = "blur(0px)";
      }
    };
  }, [targetNode]);

  if (targetNode === undefined) {
    return null;
  }

  return createPortal(
    <div className="popupConfirm">
      <div
        className="overlay"
        onClick={() => setOpenModal(false)}
        aria-checked={openModal}
        onKeyDown={(e) => e.key === "Escape" && setOpenModal(false)}
        role="switch"
        tabIndex={0}
      ></div>
      <div
        className="popupContainer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="globalModalTitle"
        aria-describedby="globalModaldesc"
      >
        {!isLoadingComplete ? (
          <div className="loading-message">
            <LoadingSpinner />
            <h3 id="globalModalTitle">Analizando playlist</h3>
          </div>
        ) : (
          <h3 id="globalModalTitle">
            {duplicateTracksIdx.length === 0 && corruptedSongsIdx.length === 0
              ? "No hay canciones corruptas ni duplicadas"
              : duplicateTracksIdx.length === 1 &&
                corruptedSongsIdx.length === 1
              ? "Hay una canción duplicada y una corrupta"
              : duplicateTracksIdx.length === 1 &&
                corruptedSongsIdx.length === 0
              ? "Hay una canción duplicada"
              : duplicateTracksIdx.length === 0 &&
                corruptedSongsIdx.length === 1
              ? "Hay una canción corrupta"
              : duplicateTracksIdx.length === 0 && corruptedSongsIdx.length > 1
              ? "Hay " + corruptedSongsIdx.length + " canciones corruptas"
              : duplicateTracksIdx.length > 1 && corruptedSongsIdx.length === 0
              ? "Hay " + duplicateTracksIdx.length + " canciones duplicadas"
              : `${corruptedSongsIdx.length} canciones corruptas y ${duplicateTracksIdx.length} canciones duplicadas`}
          </h3>
        )}
        <div className="tracks">
          {tracksToRemove.length > 0 ? (
            <List
              height={330}
              width={800}
              overscanRowCount={2}
              rowCount={tracksToRemove.length}
              rowHeight={65}
              rowRenderer={({ index, style, key }) => {
                return (
                  <div style={{ ...style, width: "100%" }} key={key}>
                    <CardTrack
                      accessToken={accessToken}
                      isTrackInLibrary={false}
                      track={tracksToRemove[index]}
                      playlistUri={pageDetails?.uri ?? ""}
                      type="album"
                    />
                  </div>
                );
              }}
            />
          ) : null}
        </div>
        <div className="popupContainer_buttons">
          <button
            type="button"
            ref={firstButtonRef}
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              setOpenModal(false);
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            ref={secondButtonRef}
            onClick={async (e) => {
              e.preventDefault();
              if (!isLibrary) {
                const indexes = [
                  ...new Set([...corruptedSongsIdx, ...duplicateTracksIdx]),
                ];
                const snapshot = await removeTracks(
                  pageDetails?.id,
                  indexes,
                  pageDetails?.snapshot_id
                );
                if (snapshot) {
                  setAllTracks((tracks) => {
                    return tracks.filter((_, i) => {
                      if (indexes.includes(i)) {
                        return false;
                      }
                      return true;
                    });
                  });
                  setTracksToRemove([]);
                  addToast({
                    variant: "success",
                    message: "Tracks removed from playlist",
                  });
                } else {
                  addToast({
                    variant: "error",
                    message: "Error removing tracks from playlist",
                  });
                }
              }

              if (isLibrary) {
                const arrays: (string | null)[][] = [];
                const ids = tracksToRemove.map(({ id }) => id as string);
                for (let i = 0; i < tracksToRemove.length; i += 50) {
                  arrays.push(ids.slice(i, i + 50));
                }
                const promises = arrays.map((ids) =>
                  fetch("https://api.spotify.com/v1/me/tracks", {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${
                        accessToken
                          ? accessToken
                          : takeCookie(ACCESS_TOKEN_COOKIE)
                      }`,
                    },
                    body: JSON.stringify({ ids }),
                  })
                );
                Promise.all(promises)
                  .then(() => {
                    setAllTracks((tracks) => {
                      return tracks.filter((track) => {
                        if (ids.includes(track.id ?? "")) {
                          return false;
                        }
                        return true;
                      });
                    });
                    setTracksToRemove([]);
                    addToast({
                      variant: "success",
                      message: "Tracks removed from library",
                    });
                  })
                  .catch(() => {
                    addToast({
                      variant: "error",
                      message: "Error removing tracks from library",
                    });
                  });
              }
            }}
          >
            Limpiar
          </button>
        </div>
      </div>
      <style jsx>{`
        .tracks {
          overflow-y: hidden;
          overflow-x: hidden;
          max-height: calc(100vh - 300px);
        }
        button:nth-of-type(2) {
          background: rgb(204, 0, 0);
          border-color: rgb(204, 0, 0);
          color: #fff;
          opacity: 0.7;
        }
        button:nth-of-type(1):hover,
        button:nth-of-type(1):focus {
          opacity: 1;
        }
      `}</style>
      <style jsx>{`
        h3 {
          text-align: center;
          margin: 0 0 10px 0;
        }
        .overlay {
          position: fixed;
          top: 0px;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.2);
        }
        .popupConfirm {
          position: fixed;
          z-index: 9999999999;
          top: 0px;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .popupContainer {
          display: block;
          position: fixed;
          width: calc(100% - 20px);
          max-width: 830px;
          padding: 10px 10px 55px 10px;
          border: 1px solid #282828;
          background: linear-gradient(
            -45deg,
            #212329,
            #202327,
            #242527,
            #464651
          );
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
          border-radius: 4px;
          min-height: 300px;
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .loading-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        p {
          margin: 0;
          font-size: 14px;
        }
        .popupContainer_buttons {
          display: flex;
          margin-top: 10px;
          justify-content: flex-end;
          flex-wrap: wrap;
          position: absolute;
          bottom: 20px;
          right: 20px;
        }
        button {
          padding: 6px 8px;
          font-weight: 400;
          background: transparent;
          border-radius: 5px;
          border: 1px solid #cccccc4d;
          cursor: pointer;
          color: inherit;
        }
        button:nth-of-type(1) {
          margin-right: 10px;
        }
        button:focus,
        button:hover {
          border: 1px solid #cccccca1;
        }
      `}</style>
    </div>,
    targetNode
  );
}
