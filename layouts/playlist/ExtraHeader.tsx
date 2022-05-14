import { ReactElement } from "react";
import useSpotify from "hooks/useSpotify";
import { PlayButton } from "../../components/forPlaylistsPage/PlayButton";

export function ExtraHeader({
  isSingle,
  track,
  uri,
}: {
  isSingle?: boolean;
  track?: SpotifyApi.TrackObjectFull;
  uri?: string;
}): ReactElement {
  const { playlistDetails } = useSpotify();
  return (
    <div>
      <PlayButton
        uri={uri}
        size={40}
        centerSize={16}
        isSingle={isSingle}
        track={track}
      />
      <span>{playlistDetails?.name}</span>
      <style jsx>{`
        span {
          color: #fff;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 28px;
          overflow: hidden;
          padding: 0 16px;
          text-overflow: ellipsis;
          pointer-events: none;
        }
        div {
          align-items: center;
          display: flex;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
