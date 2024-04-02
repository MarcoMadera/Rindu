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
  const year = releaseYear && getYear(releaseYear);

  return (
    <span ref={spanRef} className="subTitle">
      {year && <>{year} · </>}
      {albumType && <>{capitalizeFirstLetter(albumType)} · </>}
      <ArtistList artists={artists} maxArtistsToShow={2} />
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
