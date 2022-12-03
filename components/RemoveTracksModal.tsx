import { createPortal } from "react-dom";
import {
  Dispatch,
  ReactNode,
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
import Heading from "./Heading";
import useTranslations from "hooks/useTranslations";
import { templateReplace } from "utils/templateReplace";

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
  const { translations } = useTranslations();
  const [title, setTitle] = useState<string | ReactNode[]>(
    translations.analyzingPlaylist
  );

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
      setTitle(() => {
        return res.duplicateTracksIndexes.length === 0 &&
          res.corruptedSongsIndexes.length === 0
          ? translations.noCorruptOrDuplicateSongs
          : res.duplicateTracksIndexes.length === 1 &&
            res.corruptedSongsIndexes.length === 1
          ? translations.oneDuplicateOneCorrupt
          : res.duplicateTracksIndexes.length === 1 &&
            res.corruptedSongsIndexes.length === 0
          ? translations.oneDuplicate
          : res.duplicateTracksIndexes.length === 0 &&
            res.corruptedSongsIndexes.length === 1
          ? translations.oneCorrupt
          : res.duplicateTracksIndexes.length === 0 &&
            res.corruptedSongsIndexes.length > 1
          ? templateReplace(translations.multipleCorrupt, [
              res.corruptedSongsIndexes.length,
            ])
          : res.duplicateTracksIndexes.length > 1 &&
            res.corruptedSongsIndexes.length === 0
          ? templateReplace(translations.multipleDuplicate, [
              res.duplicateTracksIndexes.length,
            ])
          : templateReplace(translations.multipleCorruptAndMultipleDuplicate, [
              res.corruptedSongsIndexes.length,
              res.duplicateTracksIndexes.length,
            ]);
      });
      setIsLoadingComplete(true);
    });
  }, [accessToken, isLibrary, pageDetails, setAllTracks, translations]);

  const onPressKey = useCallback(
    (event: KeyboardEvent) => {
      const firstElement = firstButtonRef.current;
      const lastElement = secondButtonRef.current;
      if (event.key === "Escape") {
        setOpenModal(false);
      }
      if (event.key === "Tab") {
        if (document.activeElement !== firstElement) {
          firstElement?.focus();
          return event.preventDefault();
        } else {
          lastElement?.focus();
          return event.preventDefault();
        }
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
        <button
          type="button"
          ref={firstButtonRef}
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault();
            setOpenModal(false);
          }}
          className="exitButton"
          title={translations.close}
        ></button>
        {!isLoadingComplete ? (
          <div className="loading-message">
            <LoadingSpinner />
            <Heading number={2}>{title}</Heading>
          </div>
        ) : (
          <div
            className={!(tracksToRemove.length > 0) ? "loading-message" : ""}
          >
            <Heading number={2} textAlign="center">
              {title}
            </Heading>
          </div>
        )}
        <div className="tracks">
          {tracksToRemove.length > 0 ? (
            <>
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
                        position={tracksToRemove[index].position}
                      />
                    </div>
                  );
                }}
              />
              <div className="popupContainer_buttons">
                <button
                  type="button"
                  ref={secondButtonRef}
                  className="removeButton"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (!isLibrary) {
                      const indexes = [
                        ...new Set([
                          ...corruptedSongsIdx,
                          ...duplicateTracksIdx,
                        ]),
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
                        setTitle("Tracks removed from playlist");
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
                                : takeCookie(ACCESS_TOKEN_COOKIE) ?? ""
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
                          setTitle("Tracks removed from library");
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
                  {translations.cleanPlaylist}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <style jsx>{`
        .tracks {
          overflow-y: hidden;
          overflow-x: hidden;
          max-height: calc(100vh - 300px);
          margin-top: 30px;
        }
        .removeButton {
          border-radius: 500px;
          text-decoration: none;
          color: #fff;
          cursor: pointer;
          display: inline-block;
          font-family: Lato, sans-serif;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.5px;
          line-height: 18px;
          padding: 8px 20px;
          text-align: center;
          transition: all 33ms cubic-bezier(0.3, 0, 0, 1);
          white-space: nowrap;
          background-color: #1db954;
          border: 1px solid #1db954b3;
          will-change: transform;
          word-spacing: 3px;
        }
        .removeButton:focus,
        .removeButton:hover {
          background-color: #2cc963;
        }
        .removeButton:active {
          transform: scale(1);
        }
        .exitButton {
          position: absolute;
          top: 10px;
          right: 20px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          background: #15151599;
          width: 40px;
          height: 40px;
          cursor: pointer;
          border: none;
          z-index: 999999999999999;
        }
        .exitButton:after,
        .exitButton:before {
          display: block;
          content: "";
          width: 20px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
        }
        .exitButton:after {
          transform: translateX(-9.8px) rotate(135deg);
        }
        .exitButton:before {
          transform: translateX(10px) rotate(45deg);
        }
        .exitButton:focus,
        .exitButton:hover {
          background: rgba(103, 93, 93, 0.388);
        }
      `}</style>
      <style jsx>{`
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
          position: absolute;
          width: calc(100% - 20px);
          max-width: 830px;
          padding: 10px 10px 55px 10px;
          border: 1px solid #282828;
          background: linear-gradient(
            -45deg,
            #191a1d,
            #121417,
            #131314,
            #35353b
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
          justify-content: center;
          flex-wrap: wrap;
          position: absolute;
          bottom: 40px;
          left: 0;
          right: 0;
        }
      `}</style>
    </div>,
    targetNode
  );
}
