import { ReactElement } from "react";

import { PlayButton } from "components";
import { useSpotify } from "hooks";
import { ITrack } from "types/spotify";

interface PlaylistTopBarExtraFieldProps {
  isSingle?: boolean;
  track?: ITrack;
  uri?: string;
}

export default function PlaylistTopBarExtraField({
  isSingle,
  track,
  uri,
}: PlaylistTopBarExtraFieldProps): ReactElement {
  const { pageDetails, allTracks } = useSpotify();
  return (
    <div>
      <PlayButton
        uri={uri}
        size={40}
        centerSize={16}
        isSingle={isSingle}
        track={track}
        allTracks={allTracks}
      />
      <span>{pageDetails?.name}</span>
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
          max-width: 100%;
        }
      `}</style>
    </div>
  );
}
