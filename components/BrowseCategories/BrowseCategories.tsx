import { ReactElement } from "react";

import Link from "next/link";

import { Grid, Heading } from "components";
import { chooseImage, colors } from "utils";

interface IBrowseCategoriesProps {
  categories: SpotifyApi.PagingObject<SpotifyApi.CategoryObject> | null;
}

export default function BrowseCategories({
  categories,
}: Readonly<IBrowseCategoriesProps>): ReactElement {
  return (
    <Grid>
      {categories?.items.map(({ name, id, icons }, i) => {
        return (
          <Link
            key={id}
            href={`/genre/${id}`}
            style={{ backgroundColor: colors[i] }}
            className="BrowseCategories-category"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={chooseImage(icons, 100).url} alt={name} />
            <Heading number={3} as="h2">
              {name}
            </Heading>
          </Link>
        );
      })}
      <style jsx>{`
        :global(.BrowseCategories-category) {
          border: none;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          width: 100%;
          color: #fff;
        }
        :global(.BrowseCategories-category::after) {
          content: "";
          display: block;
          padding-bottom: 100%;
        }
        :global(.BrowseCategories-category h2) {
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
