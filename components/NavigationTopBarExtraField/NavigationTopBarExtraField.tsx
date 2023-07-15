import { ReactElement } from "react";

import Link from "next/link";

interface NavigationTopBarExtraFieldProps {
  selected: number;
}

export default function NavigationTopBarExtraField({
  selected,
}: NavigationTopBarExtraFieldProps): ReactElement {
  return (
    <nav className="extraField-nav">
      <ul>
        <li>
          <Link href="/collection/playlists">Playlists</Link>
        </li>
        <li>
          <Link href="/collection/podcasts">Podcasts</Link>
        </li>
        <li>
          <Link href="/collection/artists">Artists</Link>
        </li>
        <li>
          <Link href="/collection/albums">Albums</Link>
        </li>
      </ul>
      <style jsx>{`
        li:nth-of-type(${selected}) :global(a) {
          background-color: #343434;
        }
      `}</style>
      <style jsx>{`
        ul {
          display: flex;
          column-gap: 8px;
          margin-left: 24px;
        }
        li :global(a) {
          padding: 12px 18px;
          color: white;
          text-decoration: none;
          font-weight: 800;
          font-size: 13px;
          border-radius: 4px;
        }
        li {
          list-style: none;
        }
      `}</style>
    </nav>
  );
}
