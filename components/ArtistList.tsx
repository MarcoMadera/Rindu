import useOnScreen from "hooks/useOnScreen";
import Link from "next/link";
import { Fragment, ReactElement, useRef } from "react";
import { ITrack } from "types/spotify";
import { getIdFromUri } from "utils/getIdFromUri";

interface IAritstListProps {
  artists: ITrack["artists"];
  maxArtistsToShow?: number;
}

export default function ArtistList({
  artists,
  maxArtistsToShow,
}: IAritstListProps): ReactElement | null {
  const artistsRef = useRef<HTMLAnchorElement>(null);
  const isVisible = useOnScreen(artistsRef);
  if (!artists) return null;

  return (
    <>
      {artists.map((artist, i) => {
        if (maxArtistsToShow && i > maxArtistsToShow) return null;
        const id = artist.id || getIdFromUri(artist.uri, "id");
        if (!id) {
          if (artist.name) {
            return (
              <span key={artist.name} ref={artistsRef}>
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
            >
              <a
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={isVisible ? 0 : -1}
                aria-hidden={isVisible ? "false" : "true"}
                ref={artistsRef}
              >
                {artist.name}
              </a>
            </Link>
            {i !== (artists?.length && artists?.length - 1) ? ", " : null}
            <style jsx>{`
              a {
                color: inherit;
                text-decoration: none;
              }
              a:hover,
              a:focus {
                text-decoration: underline;
              }
            `}</style>
          </Fragment>
        );
      })}
    </>
  );
}
