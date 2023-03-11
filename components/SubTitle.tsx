import { ReactElement, useRef } from "react";

import { ArtistList } from "components";
import { capitalizeFirstLetter, getYear } from "utils";

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
  return (
    <span ref={spanRef} className="subTitle">
      {releaseYear && <>{getYear(releaseYear)} · </>}
      {albumType && <>{capitalizeFirstLetter(albumType)} · </>}
      <ArtistList artists={artists} maxArtistsToShow={2} />
      {artists.length > 2 ? " y más..." : null}
      <style jsx>
        {`
          span :global(a) {
            text-decoration: none;
            color: #ffffffb3;
            z-index: 3;
            position: relative;
          }
          span :global(a:hover),
          span :global(a:focus) {
            text-decoration: 1px solid underline;
            text-underline-offset: 1px;
          }
        `}
      </style>
    </span>
  );
}
