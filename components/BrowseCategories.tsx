import Link from "next/link";
import { ReactElement } from "react";
import { colors } from "utils/colors";
import Grid from "./Grid";
import Heading from "./Heading";

interface BrowseCategoriesProps {
  categories: SpotifyApi.PagingObject<SpotifyApi.CategoryObject> | null;
}

export default function BrowseCategories({
  categories,
}: BrowseCategoriesProps): ReactElement {
  return (
    <Grid>
      {categories?.items.map(({ name, id, icons }, i) => {
        return (
          <Link key={id} href={`/genre/${id}`}>
            <a style={{ backgroundColor: colors[i] }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={icons[0].url} alt={name} />
              <Heading number={3} as="h2">
                {name}
              </Heading>
            </a>
          </Link>
        );
      })}
      <style jsx>{`
        a {
          border: none;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          width: 100%;
          color: #fff;
        }
        a::after {
          content: "";
          display: block;
          padding-bottom: 100%;
        }
        a :global(h2) {
          padding: 16px;
          position: absolute;
        }
        img {
          transform: rotate(25deg) translate(18%, -2%);
          bottom: 0;
          right: 0;
          box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
          height: 100px;
          position: absolute;
          width: 100px;
          object-fit: cover;
          object-position: center center;
        }
      `}</style>
    </Grid>
  );
}
