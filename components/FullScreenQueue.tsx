import { ReactElement } from "react";

import { CardTrack, ContentContainer, Heading } from "components";
import { CardType } from "components/CardTrack/CardTrack";
import { useAuth, useSpotify, useTranslations } from "hooks";

export default function FullScreenQueue(): ReactElement {
  const { previousTracks, currentlyPlaying, nextTracks, playlistPlayingId } =
    useSpotify();
  const { accessToken } = useAuth();
  const playlistUri = playlistPlayingId
    ? `spotify:playlist:${playlistPlayingId}`
    : "";
  const { translations } = useTranslations();

  return (
    <>
      <ContentContainer hasPageHeader>
        <div className="queue">
          <div className="queue__tracks">
            {previousTracks.length > 0 && (
              <Heading number={3}>{translations.previousTracks}</Heading>
            )}
            {previousTracks.map((track) => (
              <CardTrack
                key={track.id}
                track={track}
                accessToken={accessToken}
                playlistUri={playlistUri}
                isTrackInLibrary={false}
                type={CardType.Presentation}
                isSingleTrack
                uri={track.uri}
              />
            ))}
            {currentlyPlaying && (
              <Heading number={3}>{translations.currentlyPlaying}</Heading>
            )}
            {currentlyPlaying && (
              <CardTrack
                key={currentlyPlaying.id}
                track={currentlyPlaying}
                accessToken={accessToken}
                playlistUri={playlistUri}
                isTrackInLibrary={false}
                type={CardType.Presentation}
                isSingleTrack
                uri={currentlyPlaying.uri}
              />
            )}
            {nextTracks.length > 0 && (
              <Heading number={3}>{translations.nextUp}</Heading>
            )}
            {nextTracks.map((track) => (
              <CardTrack
                key={track.id}
                track={track}
                accessToken={accessToken}
                playlistUri={playlistUri}
                isTrackInLibrary={false}
                type={CardType.Presentation}
                isSingleTrack
                uri={track.uri}
              />
            ))}
          </div>
          <style jsx>{`
            :global(body .app:fullscreen main) {
              height: calc(100vh);
            }
            :global(body .app:fullscreen .back-to-player) {
              display: block;
            }
            .queue {
              display: flex;
              flex-direction: column;
              height: 100%;
              width: 100%;
              overflow-y: auto;
              overflow-x: hidden;
              position: relative;
              padding: 40px 40px 0 40px;
            }
            .queue__tracks {
              display: flex;
              flex-direction: column;
              gap: 10px;
              padding: 20px 0;
              width: 100%;
            }
          `}</style>
        </div>
      </ContentContainer>
    </>
  );
}
