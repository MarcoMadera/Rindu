import { PropsWithChildren, ReactElement, useEffect } from "react";

import { useRouter } from "next/router";

import { useContextMenu, useHeader } from "hooks";
import { ITrack } from "types/spotify";
import { getMainColorFromImage } from "utils";

interface PageDetailsProps {
  data?:
    | ITrack
    | SpotifyApi.UserObjectPublic
    | SpotifyApi.PlaylistObjectFull
    | SpotifyApi.AlbumObjectFull
    | SpotifyApi.ArtistObjectFull
    | SpotifyApi.ShowObject
    | null;
  banner?: string;
  disableOpacityChange?: boolean;
}

export default function PageDetails({
  children,
  data,
  banner,
  disableOpacityChange,
}: PropsWithChildren<PageDetailsProps>): ReactElement {
  const { setHeaderColor } = useHeader({
    disableOpacityChange,
  });
  const { addContextMenu } = useContextMenu();
  const router = useRouter();

  useEffect(() => {
    if (!banner) return;
    getMainColorFromImage("banner", setHeaderColor);
  }, [banner, router.asPath, setHeaderColor]);

  return (
    <>
      {banner ? (
        <div id="banner-container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={banner} alt="" className="banner" id="banner" />
          <div className="banner-background"></div>
        </div>
      ) : null}
      <header
        onContextMenu={(e) => {
          e.preventDefault();
          const x = e.pageX;
          const y = e.pageY;
          if (data) {
            addContextMenu({
              type: "cardTrack",
              data,
              position: { x, y },
            });
          }
        }}
      >
        <div className="b-1"></div>
        <div className="b-2"></div>
        <section>{children}</section>
      </header>
      <div className="bg-12"></div>
      <style jsx>{`
        .banner {
          height: ${banner ? "40vh" : "0"};
          min-height: ${banner ? "40vh" : "0"};
          transform: scale(calc(1.027 - (var(--banner-opacity, 0) + 0.3) / 50));
        }
        .banner-background {
          min-height: ${banner ? "40vh" : "0"};
        }
        .banner-background:after {
          min-height: ${banner ? "40vh" : "0"};
          opacity: calc(var(--banner-opacity, 0) * 2);
          background-image: linear-gradient(
              rgba(0, 0, 0, 0.6),
              rgba(0, 0, 0, 0.6)
            ),
            linear-gradient(
              var(--header-color, transparent),
              var(--header-color, transparent)
            );
        }
        .bg-12 {
          background-color: var(--header-color, transparent);
          z-index: ${banner ? "999999" : "0"};
        }
        header {
          min-height: ${banner ? "40vh" : "340px"};
          background: ${banner ? "transparent" : "#535353"};
          margin-top: ${banner ? "-40vh" : "0"};
        }
        div.b-1 {
          background-color: ${banner
            ? "transparent"
            : "var(--header-color, transparent)"};
        }
        div.b-2 {
          background-image: ${banner
            ? "none"
            : "linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%),url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')"};
        }
      `}</style>
      <style jsx>{`
        section {
          display: flex;
          height: 232px;
          min-width: 232px;
          width: 100%;
          margin-top: 60px;
          position: absolute;
        }
        .banner-container {
          position: relative;
        }
        .banner {
          width: 100%;
          position: sticky;
          top: 0;
          background-size: cover;
          background-position-y: -50px;
          background-repeat: no-repeat;
          max-height: 500px;
          object-fit: cover;
          display: block;
          object-position: top;
        }
        .banner-background {
          contain: strict;
          position: absolute;
          width: 100%;
          top: 0;
          max-height: 500px;
          background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%),
            url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=");
        }
        .banner-background:after {
          display: block;
          content: "";
        }
        .bg-12 {
          background-image: linear-gradient(rgba(0, 0, 0, 0.6) 0, #121212 100%),
            url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=");
          height: 232px;
          position: absolute;
          width: 100%;
          transition: background-color 0.25s ease;
        }
        header {
          display: flex;
          align-items: center;
          padding: 0 32px;
          height: 30vh;
          max-height: 500px;
          width: 100%;
          position: relative;
        }
        div.b-1 {
          transition: background-color 0.25s ease;
        }
        .b-1,
        .b-2 {
          display: block;
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }
        @media screen and (max-width: 768px) {
          section {
            display: block;
            text-align: center;
            position: relative;
            margin-top: ${banner ? "180px" : "0px"};
          }
          header {
            display: flex;
            align-items: center;
            padding: 0 32px;
            height: 35vh;
            min-height: ${banner ? "320px" : "500px"};
            max-height: 700px;
            width: 100%;
            position: relative;
          }
        }
      `}</style>
    </>
  );
}
