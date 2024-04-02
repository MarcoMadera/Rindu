import { Fragment, ReactElement, useRef } from "react";

import Link from "next/link";

import { useTranslations } from "hooks";
import { ITrack, ITrackArtist } from "types/spotify";
import { conjuction, getIdFromUri } from "utils";

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
}: Readonly<IArtistListProps>): ReactElement | null {
  const artistsRef = useRef<HTMLAnchorElement>(null);
  const { locale } = useTranslations();
  if (!artists) return null;

  return (
    <span>
      {conjuction(
        artists
          .slice(0, maxArtistsToShow ?? artists.length)
          .filter((el) => el.name)
          .map((artist) => {
            const id = getArtistId(artist);

            if (!id) {
              return (
                <span key={artist.name} ref={artistsRef} className="ArtistList">
                  {artist.name}
                </span>
              );
            }

            return (
              <Fragment key={id}>
                <Link
                  href={`/${
                    artist.type ?? getIdFromUri(artist.uri, "type") ?? "artist"
                  }/${id}`}
                  ref={artistsRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onClick) onClick(e);
                  }}
                  className="ArtistList"
                >
                  {artist.name}
                </Link>
              </Fragment>
            );
          }),
        locale
      )}
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
