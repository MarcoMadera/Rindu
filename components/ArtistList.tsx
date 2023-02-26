import { useOnScreen } from "hooks";
import Link from "next/link";
import { Fragment, ReactElement, useRef } from "react";
import { ITrack } from "types/spotify";
import { getIdFromUri } from "utils/getIdFromUri";

interface IAritstListProps {
  artists: ITrack["artists"];
  maxArtistsToShow?: number;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function ArtistList({
  artists,
  maxArtistsToShow,
  onClick,
}: IAritstListProps): ReactElement | null {
  const artistsRef = useRef<HTMLAnchorElement>(null);
  const isVisible = useOnScreen(artistsRef);
  if (!artists) return null;

  return (
    <span>
      {artists.map((artist, i) => {
        if (maxArtistsToShow && i > maxArtistsToShow) return null;
        const id = artist.id || getIdFromUri(artist.uri, "id");
        if (!id) {
          if (artist.name) {
            return (
              <span key={artist.name} ref={artistsRef} className="ArtistList">
                {artist.name}
                {i !== (artists?.length || 0) - 1 ? ", " : ""}
              </span>
            );
          }

          return null;
        }
        return (
          <Fragment key={artist.id || artist.uri}>
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
            {i !== (artists?.length && artists?.length - 1) ? ", " : null}
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
