import Link from "next/link";
import { ReactElement } from "react";

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
          <Link href="/collection/playlists">
            <a>Playlists</a>
          </Link>
        </li>
        <li>
          <Link href="/collection/podcasts">
            <a>Podcasts</a>
          </Link>
        </li>
        <li>
          <Link href="/collection/artists">
            <a>Artists</a>
          </Link>
        </li>
        <li>
          <Link href="/collection/albums">
            <a>Albums</a>
          </Link>
        </li>
      </ul>
      <style jsx>{`
        li:nth-of-type(${selected}) a {
          background-color: #343434;
        }
      `}</style>
      <style jsx>{`
        ul {
          display: flex;
          column-gap: 8px;
          margin-left: 24px;
        }
        a {
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
