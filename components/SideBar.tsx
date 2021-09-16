import useSpotify from "hooks/useSpotify";
import { ReactElement, ReactNode } from "react";
import Logo from "./Logo";
import Link from "next/link";

interface SideBarProps {
  children: ReactNode;
}

export default function SideBar({ children }: SideBarProps): ReactElement {
  const { playlists } = useSpotify();
  return (
    <>
      <div className="container">
        <nav>
          <div className="logo">
            <Logo />
          </div>
          <section>
            {playlists.map(({ id, name }) => {
              return (
                <Link key={id} href={`/playlist/${encodeURIComponent(id)}`}>
                  <a>{name}</a>
                </Link>
              );
            })}
          </section>
        </nav>
        {children}
        <style jsx>{`
          nav {
            background-color: #010101;
            width: 245px;
            min-width: 245px;
            overflow: hidden;
          }
          section {
            height: calc(100% - 90px);
            overflow-y: scroll;
            margin: 40px 0 20px 0;
            padding: 0 20px 20px 20px;
          }
          span {
          }
          a {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #b3b3b3;
            cursor: default;
            text-decoration: none;
            overflow: hidden;
            margin-bottom: 10px;
          }
          div.container {
            height: calc(100vh - 90px);
            display: flex;
          }
          .logo {
            text-align: center;
            width: 100%;
          }
        `}</style>
      </div>
    </>
  );
}
