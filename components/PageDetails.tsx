import useContextMenu from "hooks/useContextMenu";
import useHeader from "hooks/useHeader";
import { useRouter } from "next/router";
import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { normalTrackTypes } from "types/spotify";
import { getMainColorFromImage } from "utils/getMainColorFromImage";

export default function PageDetails({
  children,
  data,
  banner,
  disableOpacityChange,
}: {
  children: ReactNode;
  data: normalTrackTypes | null;
  banner?: string;
  disableOpacityChange?: boolean;
}): ReactElement {
  const { headerColor, setHeaderColor, headerOpacity } = useHeader({
    disableOpacityChange,
  });
  const { addContextMenu } = useContextMenu();
  const [imageIsLoaded, setImageIsLoaded] = useState(false);
  const image = useRef<HTMLImageElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!banner) return;
    if (image.current?.complete || imageIsLoaded) {
      setHeaderColor((prev) => getMainColorFromImage("banner") ?? prev);
    }
  }, [banner, imageIsLoaded, router.asPath, setHeaderColor]);

  return (
    <>
      {banner ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={banner}
            ref={image}
            alt=""
            onLoad={() => {
              setHeaderColor((prev) => getMainColorFromImage("banner") ?? prev);
              setImageIsLoaded(true);
            }}
            className="banner"
            id="banner"
            style={{
              transform: `scale(${1.027 - (headerOpacity + 0.3) / 50})`,
            }}
          />
          <div className="banner-background"></div>
        </>
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
        style={{
          boxShadow: `inset 0px -20px 300px 30px rgba(0, 0, 0, ${
            0.5 - headerOpacity - 0.3
          })`,
        }}
      >
        <div className="b-1"></div>
        <div className="b-2"></div>
        <section>{children}</section>
      </header>
      <div className="bg-12"></div>
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
          height: ${banner ? "40vh" : "0"};
          width: 100%;
          position: sticky;
          top: 0;
          background-size: cover;
          background-position-y: -50px;
          background-repeat: no-repeat;
          max-height: 500px;
          min-height: ${banner ? "40vh" : "0"};
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
          min-height: ${banner ? "40vh" : "0"};
          background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%),
            url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=");
        }
        .banner-background:after {
          display: block;
          min-height: ${banner ? "40vh" : "0"};
          opacity: ${headerOpacity * 2};
          content: "";
          background-image: linear-gradient(
              rgba(0, 0, 0, 0.6),
              rgba(0, 0, 0, 0.6)
            ),
            linear-gradient(${headerColor}, ${headerColor});
        }
        .bg-12 {
          background-image: linear-gradient(rgba(0, 0, 0, 0.6) 0, #121212 100%),
            url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=");
          height: 232px;
          position: absolute;
          width: 100%;
          background-color: ${headerColor ?? "transparent"};
          transition: background-color 0.3s ease;
          z-index: ${banner ? "999999" : "0"};
        }

        header {
          display: flex;
          align-items: center;
          padding: 0 32px;
          height: 30vh;
          max-height: 500px;
          min-height: ${banner ? "40vh" : "340px"};
          width: 100%;
          background: ${banner ? "transparent" : "#535353"};
          position: relative;
          margin-top: ${banner ? "-40vh" : "0"};
        }
        div.b-1 {
          background-color: ${banner
            ? "transparent"
            : headerColor ?? "transparent"};
          transition: background-color 0.3s ease;
        }
        div.b-2 {
          background-image: ${banner
            ? "transparent"
            : "linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%),url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')"};
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
      `}</style>
    </>
  );
}
