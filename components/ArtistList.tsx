import { Fragment, ReactElement, useRef } from "react";

import Link from "next/link";

import { useOnScreen } from "hooks";
import { ITrack, ITrackArtist } from "types/spotify";
import { getIdFromUri } from "utils";

export interface IArtistListProps {
  artists: ITrack["artists"];
  maxArtistsToShow?: number;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

function getArtistId(artist: ITrackArtist): string | undefined {
  return artist.id ?? getIdFromUri(artist.uri, "id");
}

export default function ArtistList({
  artists,
  maxArtistsToShow,
  onClick,
}: IArtistListProps): ReactElement | null {
  const artistsRef = useRef<HTMLAnchorElement>(null);
  const isVisible = useOnScreen(artistsRef);
  if (!artists) return null;
  const { length } = artists;

  return (
    <span>
      {artists.map((artist, i) => {
        const id = getArtistId(artist);
        if (maxArtistsToShow && i >= maxArtistsToShow) return null;

        if (!id && artist.name) {
          return (
            <span key={artist.name} ref={artistsRef} className="ArtistList">
              {artist.name}
              {i !== length - 1 ? ", " : ""}
            </span>
          );
        }

        if (!id) return null;

        return (
          <Fragment key={id}>
            <Link
              href={`/${
                artist.type ?? getIdFromUri(artist.uri, "type") ?? "artist"
              }/${id}`}
              tabIndex={isVisible ? 0 : -1}
              aria-hidden={isVisible ? "false" : "true"}
              ref={artistsRef}
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick(e);
              }}
              className="ArtistList"
            >
              {artist.name}
            </Link>
            {i !== length - 1 ? ", " : null}
          </Fragment>
        );
      })}
      <style jsx>{`
        span :global(.ArtistList) {
          color: inherit;
          text-decoration: none;
        }
        span :global(.ArtistList:hover),
        span :global(.ArtistList:focus) {
          text-decoration: underline;
        }
      `}</style>
    </span>
  );
}
