import { ReactElement } from "react";

import { Grid, Heading, SingleTrackCard } from "components";
import { ITrack } from "types/spotify";

interface TopTracksProps {
  topTracks: ITrack[];
  heading: string;
}

export default function TopTracks({
  heading,
  topTracks,
}: Readonly<TopTracksProps>): ReactElement {
  return (
    <>
      <Heading number={2}>{heading}</Heading>
      <div>
        <Grid minWidthItem="max(190px, 25%)" marginBottom="50px">
          {topTracks?.map((track, i) => {
            if (i >= 9) return null;
            return <SingleTrackCard key={track.id} track={track} />;
          })}
        </Grid>
      </div>
      <style jsx>{`
        @media screen and (max-width: 768px) {
          div {
            padding: 0 8px;
          }
        }
      `}</style>
    </>
  );
}
