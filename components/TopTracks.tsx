import { ReactElement } from "react";
import Heading from "./Heading";
import SingleTrackCard from "./SingleTrackCard";

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
      <section>
        {topTracks &&
          topTracks?.items?.map((track, i) => {
            if (i >= 9) return null;
            return <SingleTrackCard key={track.id} track={track} />;
          })}
      </section>
      <style jsx>{`
        section {
          grid-gap: 16px 24px;
          display: grid;
          grid-template: auto/repeat(auto-fill, minmax(max(270px, 25%), 1fr));
          grid-gap: 24px;
          margin: 20px 0 50px 0;
          justify-content: space-between;
          transition: 400ms ease-in;
        }
      `}</style>
    </>
  );
}
