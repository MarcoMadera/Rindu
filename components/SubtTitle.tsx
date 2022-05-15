import useOnScreen from "hooks/useOnScreen";
import Link from "next/link";
import { Fragment, ReactElement, useRef } from "react";
import { capitalizeFirstLetter } from "utils/capitalizeFirstLetter";
import { getYear } from "utils/getYear";

export default function SubTitle({
  artists,
  albumType,
  releaseYear,
}: {
  artists: SpotifyApi.ArtistObjectSimplified[];
  albumType?: SpotifyApi.AlbumObjectSimplified["album_type"];
  releaseYear?: string;
}): ReactElement {
  const spanRef = useRef<HTMLSpanElement>(null);
  const isVisible = useOnScreen(spanRef, "-150px");
  return (
    <span ref={spanRef} className="subTitle">
      {releaseYear && <>{getYear(releaseYear)} · </>}
      {albumType && <>{capitalizeFirstLetter(albumType)} · </>}
      {artists?.map((artist, i) => {
        const idFromUri = artist.uri.split(":")[2];
        if (i > 2) return null;
        return (
          <Fragment key={artist.id ?? idFromUri}>
            <Link href={`/artist/${artist.id ?? idFromUri}`}>
              <a
                className="link"
                aria-hidden={isVisible ? "false" : "true"}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={isVisible ? 0 : -1}
              >
                {artist.name}
              </a>
            </Link>
            {i !== (artists?.length && artists?.length - 1) ? ", " : null}
          </Fragment>
        );
      })}
      {artists.length > 2 ? " y más..." : null}
      <style jsx>
        {`
          .link {
            text-decoration: none;
            color: #b3b3b3;
          }
          .link:hover,
          .link:focus {
            text-decoration: 1px solid underline;
            text-underline-offset: 1px;
          }
        `}
      </style>
    </span>
  );
}
