import { ReactElement } from "react";

import { CardTrack, Carousel, FirstTrackContainer } from "components";
import { CardType } from "components/CardTrack/CardTrack";
import { ITrack } from "types/spotify";
import { divideArray, isCorruptedTrack } from "utils";
interface MainTracksProps {
  title: string;
  tracksRecommendations: ITrack[];
  tracksInLibrary?: boolean[] | null;
}

export default function MainTracks({
  title,
  tracksRecommendations,
  tracksInLibrary,
}: Readonly<MainTracksProps>): ReactElement {
  const filteredTracks = tracksRecommendations?.filter(
    (track, index, self) => index === self.findIndex((t) => t.id === track.id)
  );
  const allTracks = filteredTracks?.map((track) => {
    return {
      ...track,
      audio: track?.preview_url,
      corruptedTrack: isCorruptedTrack(track),
    };
  });

  return (
    <Carousel title={title} gap={24}>
      {divideArray(filteredTracks, 5).map((tracks, i) => {
        const tracksId = tracks
          .slice(0, i)
          .map((track) => track.id)
          .join("-");
        return (
          <div className="tracks" key={`${tracksId}-${i}}`}>
            <FirstTrackContainer
              track={tracks?.[0]}
              preview={tracks?.[0]?.preview_url}
              position={i * 5}
              allTracks={allTracks}
            />
            <div>
              {tracks?.map((track, chunkIndex) => {
                if (chunkIndex === 0 || chunkIndex > 4 || !track) {
                  return null;
                }
                const index = i * 5 + chunkIndex;
                const uris = filteredTracks?.map((track) => track.uri ?? "");

                return (
                  <CardTrack
                    isTrackInLibrary={tracksInLibrary?.[index] ?? false}
                    playlistUri=""
                    track={track}
                    key={`${tracksId}-${index}-${chunkIndex}}`}
                    type={CardType.Presentation}
                    position={index}
                    isSingleTrack
                    uris={uris}
                  />
                );
              })}
            </div>
            <style jsx>{`
              .tracks {
                display: grid;
                grid-template-columns: 49% 49%;
                width: 100%;
                grid-gap: 20px;
                margin: 10px 0 30px;
                min-width: calc(100% - 24px);
              }
              @media (max-width: 1000px) {
                .tracks {
                  grid-template-columns: 100%;
                }
              }
            `}</style>
          </div>
        );
      })}
    </Carousel>
  );
}
