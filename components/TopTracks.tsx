import { ReactElement } from "react";

import { Grid, Heading, SingleTrackCard } from "components";

interface TopTracksProps {
  topTracks: SpotifyApi.UsersTopTracksResponse;
  heading: string;
}

export default function TopTracks({
  heading,
  topTracks,
}: TopTracksProps): ReactElement {
  return (
    <>
      <Heading number={2}>{heading}</Heading>
      <Grid minWidthItem="max(270px, 25%)" marginBottom="50px">
        {topTracks &&
          topTracks.items?.map((track, i) => {
            if (i >= 9) return null;
            return <SingleTrackCard key={track.id} track={track} />;
          })}
      </Grid>
    </>
  );
}
