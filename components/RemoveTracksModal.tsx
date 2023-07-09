import { ReactElement, ReactNode, useEffect, useState } from "react";

import { List, ListRowProps } from "react-virtualized";

import { Button, CardTrack, Heading, LoadingSpinner } from "components";
import { CardType } from "components/CardTrack/CardTrack";
import { useAuth, useSpotify, useToast, useTranslations } from "hooks";
import { AsType } from "types/heading";
import { IPageDetails, ITrack } from "types/spotify";
import {
  analyzePlaylist,
  ContentType,
  divideArray,
  templateReplace,
  ToastMessage,
} from "utils";
import { removeTracksFromLibrary } from "utils/spotifyCalls";

interface RemoveTracksModalProps {
  isLibrary: boolean;
}

function renderListRow({
  style,
  key,
  index,
  tracksToRemove,
  pageDetails,
  accessToken,
}: ListRowProps & {
  accessToken?: string;
  tracksToRemove: ITrack[];
  pageDetails: IPageDetails | null;
}): ReactElement {
  return (
    <div style={{ ...style, width: "100%" }} key={key}>
      <CardTrack
        accessToken={accessToken}
        isTrackInLibrary={false}
        track={tracksToRemove[index]}
        playlistUri={pageDetails?.uri ?? ""}
        type={CardType.Album}
        position={tracksToRemove[index].position}
      />
    </div>
  );
}

export default function RemoveTracksModal({
  isLibrary,
}: RemoveTracksModalProps): ReactElement {
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
      pageDetails.id,
      pageDetails.tracks?.total,
      isLibrary,
      accessToken,
      translations
    ).then((res) => {
      if (!res) return;

      setAllTracks(res.tracks);
      setDuplicateTracksIdx(res.duplicateTracksIndexes);
      setCorruptedSongsIdx(res.corruptedSongsIndexes);
      setTracksToRemove(res.tracksToRemove);
      setTitle(res.summary);
      setIsLoadingComplete(true);
    });
  }, [accessToken, isLibrary, pageDetails, setAllTracks, translations]);

  async function handleRemoveTracksFromLibrary() {
    const ids = tracksToRemove
      .map(({ id }) => id)
      .filter((id) => id) as string[];

    const idChunks = divideArray(ids, 50);
    const promises = idChunks.map((ids) =>
      removeTracksFromLibrary(ids, accessToken)
    );
    try {
      await Promise.all(promises);
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
        message: templateReplace(translations[ToastMessage.TypeRemovedFrom], [
          translations[ContentType.Items],
          translations[ContentType.Library],
        ]),
      });
    } catch (error) {
      addToast({
        variant: "error",
        message: templateReplace(
          translations[ToastMessage.CouldNotRemoveFrom],
          [translations[ContentType.Library]]
        ),
      });
    }
  }

  async function handleRemoveTracksFromPlaylist() {
    const indexes = [...new Set([...corruptedSongsIdx, ...duplicateTracksIdx])];
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
      setTitle(
        templateReplace(translations[ToastMessage.TypeRemovedFrom], [
          translations[ContentType.Items],
          translations[ContentType.Playlist],
        ])
      );
      addToast({
        variant: "success",
        message: templateReplace(translations[ToastMessage.TypeRemovedFrom], [
          translations[ContentType.Items],
          translations[ContentType.Playlist],
        ]),
      });
    } else {
      addToast({
        variant: "error",
        message: templateReplace(
          translations[ToastMessage.CouldNotRemoveFrom],
          [translations[ContentType.Playlist]]
        ),
      });
    }
  }

  return (
    <div>
      {!isLoadingComplete ? (
        <div className="loading-message">
          <LoadingSpinner />
        </div>
      ) : null}
      <div className="tracks">
        {tracksToRemove.length === 0 ? (
          <div className={tracksToRemove.length === 0 ? "loading-message" : ""}>
            <Heading number={4} textAlign="center" as={AsType.P}>
              {title}
            </Heading>
          </div>
        ) : null}
        {tracksToRemove.length > 0 ? (
          <>
            <List
              height={
                tracksToRemove.length > 5 ? 400 : 65 * tracksToRemove.length
              }
              width={800}
              overscanRowCount={2}
              rowCount={tracksToRemove.length}
              rowHeight={65}
              rowRenderer={(listRowProps) =>
                renderListRow({
                  ...listRowProps,
                  tracksToRemove,
                  pageDetails,
                  accessToken,
                })
              }
            />
            <div
              className={tracksToRemove.length === 0 ? "loading-message" : ""}
            >
              <Heading number={4} textAlign="center" as={AsType.P}>
                {title}
              </Heading>
            </div>
            <div className="popupContainer_buttons">
              <Button
                type="button"
                tabIndex={0}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isLibrary) {
                    await handleRemoveTracksFromLibrary();
                    return;
                  }
                  await handleRemoveTracksFromPlaylist();
                }}
              >
                {translations.cleanPlaylist}
              </Button>
            </div>
          </>
        ) : null}
        <style jsx>{`
          .tracks {
            overflow-y: hidden;
            overflow-x: hidden;
            max-height: calc((var(--vh, 1vh) * 100) - 300px);
            margin-top: 30px;
          }
          .loading-message {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          p {
            margin: 0;
            font-size: 14px;
          }
          .popupContainer_buttons {
            display: flex;
            margin-top: 24px;
            justify-content: center;
            flex-wrap: wrap;
          }
        `}</style>
      </div>
    </div>
  );
}
