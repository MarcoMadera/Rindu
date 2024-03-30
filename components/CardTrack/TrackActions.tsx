import { Dispatch, ReactElement, SetStateAction, useRef } from "react";

import { Heart, ThreeDots } from "components/icons";
import { useContextMenu, useOnScreen, useToast, useTranslations } from "hooks";
import { ITrack } from "types/spotify";
import { formatTime, templateReplace } from "utils";
import {
  removeEpisodesFromLibrary,
  removeTracksFromLibrary,
  saveEpisodesToLibrary,
  saveTracksToLibrary,
} from "utils/spotifyCalls";

interface ITrackActions {
  mouseEnter: boolean;
  isFocusing: boolean;
  setIsLikedTrack: Dispatch<SetStateAction<boolean | undefined>>;
  isTrackInLibrary?: boolean;
  track: ITrack;
  onClickAdd?: () => void;
}
export function TrackActions({
  mouseEnter,
  isFocusing,
  setIsLikedTrack,
  isTrackInLibrary,
  track,
  onClickAdd,
}: Readonly<ITrackActions>): ReactElement {
  const trackRef = useRef<HTMLDivElement>(null);
  const { addContextMenu } = useContextMenu();
  const { addToast } = useToast();
  const { translations } = useTranslations();
  const isVisible = useOnScreen(trackRef);

  return (
    <section className="extras">
      <Heart
        className="trackHeart"
        active={!!isTrackInLibrary}
        tabIndex={isVisible ? 0 : -1}
        aria-hidden={isVisible ? "false" : "true"}
        handleLike={async () => {
          const saveToLibrary =
            track.type === "episode"
              ? saveEpisodesToLibrary
              : saveTracksToLibrary;
          const saveRes = await saveToLibrary([track.id ?? ""]);
          if (saveRes) {
            setIsLikedTrack(true);
            addToast({
              variant: "success",
              message: templateReplace(translations.toastMessages.typeAddedTo, [
                `${
                  track.type === "episode"
                    ? translations.contentType.episode
                    : translations.contentType.track
                }`,
                translations.contentType.library,
              ]),
            });
            return true;
          }
          return null;
        }}
        handleDislike={async () => {
          const removeFromLibrary =
            track.type === "episode"
              ? removeEpisodesFromLibrary
              : removeTracksFromLibrary;
          const removeRes = await removeFromLibrary([track.id ?? ""]);
          if (removeRes) {
            setIsLikedTrack(false);
            addToast({
              variant: "success",
              message: templateReplace(
                translations.toastMessages.typeRemovedFrom,
                [
                  `${
                    track.type === "episode"
                      ? translations.contentType.episode
                      : translations.contentType.track
                  }`,
                  translations.contentType.library,
                ]
              ),
            });
            return true;
          }
          return null;
        }}
      />
      <p className="trackArtists time">
        {track.duration_ms ? formatTime(track.duration_ms / 1000) : ""}
      </p>
      {onClickAdd && (
        <button
          type="button"
          className="add"
          onClick={onClickAdd}
          tabIndex={isVisible ? 0 : -1}
          aria-hidden={isVisible ? "false" : "true"}
        >
          Add
        </button>
      )}
      <button
        type="button"
        className="options"
        aria-label="Show more options"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          const x = e.pageX;
          const y = e.pageY;
          addContextMenu({
            type: "cardTrack",
            data: track,
            position: { x, y },
          });
        }}
        tabIndex={isVisible ? 0 : -1}
        aria-hidden={isVisible ? "false" : "true"}
      >
        {mouseEnter || isFocusing ? (
          <ThreeDots />
        ) : (
          <div className="threeDots"></div>
        )}
      </button>
      <style jsx>{`
        .options {
          width: ${onClickAdd ? "40px" : "32px"};
          height: ${onClickAdd ? "40px" : "32px"};
        }
      `}</style>
      <style jsx>{`
        :global(.trackItem) section.extras {
          justify-content: center;
        }
        .threeDots {
          width: 16px;
        }
        section.extras button.options {
          margin: 0;
          display: flex;
          align-items: center;
          background: transparent;
          border: none;
        }
        .options {
          color: #ffffffb3;
          justify-content: center;
        }
        .options:hover,
        .options:focus {
          color: #ffffff;
        }
        :global(.trackItem) .trackArtists.time {
          overflow: unset;
          min-width: 50px;
          text-align: center;
        }
        .add {
          align-items: center;
          background-color: transparent;
          border-radius: 500px;
          border: 1px solid #535353;
          color: #fff;
          cursor: auto;
          display: flex;
          font-size: 0.875rem;
          font-weight: 700;
          height: initial;
          justify-content: center;
          letter-spacing: 1.76px;
          line-height: 1rem;
          margin: 0;
          padding: 6px 28px;
          text-decoration: none;
          touch-action: manipulation;
          transition: all 33ms cubic-bezier(0.3, 0, 0, 1);
          user-select: none;
          white-space: nowrap;
          width: 40px;
          will-change: transform;
        }
        .add:hover,
        .add:focus {
          transform: scale(1.04);
          border-color: #fff;
        }
        .add:active {
          transform: scale(0.96);
        }
      `}</style>
    </section>
  );
}
