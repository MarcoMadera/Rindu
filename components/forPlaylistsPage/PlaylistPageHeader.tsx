import React from "react";
import { decode } from "html-entities";
import { SITE_URL } from "../../utils/constants";
import Link from "next/link";
import formatNumber from "utils/formatNumber";
import { ContentHeader } from "./ContentHeader";
import useHeader from "hooks/useHeader";
import { getMainColorFromImage } from "utils/getMainColorFromImage";

export interface PlaylistPageHeaderProps {
  playlistDetails: SpotifyApi.SinglePlaylistResponse | null;
}

export const PlaylistPageHeader: React.FC<PlaylistPageHeaderProps> = ({
  playlistDetails,
}) => {
  const { setHeaderColor } = useHeader();
  const coverImg =
    playlistDetails?.images[0]?.url ??
    playlistDetails?.images[1]?.url ??
    `${SITE_URL}/defaultSongCover.jpeg`;

  const playlistName = playlistDetails?.name ?? "";

  return (
    <ContentHeader>
      <img
        src={coverImg}
        alt=""
        id="cover-image"
        onLoad={() => {
          setHeaderColor(
            (prev) => getMainColorFromImage("cover-image") ?? prev
          );
        }}
      />
      <div className="playlistInfo">
        <h2>PLAYLIST</h2>
        <h1>{playlistDetails?.name}</h1>
        <p className="description">{decode(playlistDetails?.description)}</p>
        <div>
          <p>
            <Link href={`/user/${playlistDetails?.owner.id}`}>
              <a className="userLink">
                {decode(playlistDetails?.owner.display_name)}
              </a>
            </Link>
            {(playlistDetails?.followers.total ?? 0) > 0 ? (
              <span>
                &nbsp;&middot;{" "}
                {formatNumber(playlistDetails?.followers.total ?? 0)} seguidores
              </span>
            ) : null}
            <span>
              &nbsp;&middot; {formatNumber(playlistDetails?.tracks.total ?? 0)}{" "}
              canciones
            </span>
          </p>
        </div>
      </div>
      <style jsx>
        {`
          h1 {
            color: #fff;
            margin: 0;
            pointer-events: none;
            user-select: none;
            padding: 0.08em 0px;
            font-size: ${playlistName.length < 18
              ? "96px"
              : playlistName.length < 30
              ? "72px"
              : "48px"};
            line-height: ${playlistName.length < 20
              ? "96px"
              : playlistName.length < 30
              ? "72px"
              : "48px"};
            visibility: visible;
            width: 100%;
            font-weight: 900;
            letter-spacing: -0.04em;
            text-transform: none;
            overflow: hidden;
            text-align: left;
            text-overflow: ellipsis;
            white-space: unset;
            -webkit-box-orient: vertical;
            display: -webkit-box;
            line-break: anywhere;
            -webkit-line-clamp: 3;
          }
          h2 {
            font-size: 12px;
            margin-top: 4px;
            margin-bottom: 0;
            font-weight: 700;
          }
          div.playlistInfo {
            align-self: flex-end;
            width: calc(100% - 310px);
          }
          p.description {
            margin-bottom: 4px;
            font-size: 14px;
            word-spacing: 2px;
            line-height: 1.4;
          }
          .userLink {
            display: inline-block;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: normal;
            line-height: 16px;
            text-transform: none;
            color: #fff;
            text-decoration: none;
          }
          .userLink:hover,
          .userLink:focus {
            text-decoration: underline;
          }
          button {
            border: none;
            border-radius: 4px;
            background-color: #e83636;
            cursor: pointer;
            padding: 4px 6px;
            color: #fff;
          }
          p {
            margin: 0;
            color: #ffffffb3;
          }
          span {
            font-size: 14px;
            display: inline-block;
          }

          img {
            margin-right: 15px;
            align-self: center;
            align-self: flex-end;
            height: 232px;
            margin-inline-end: 24px;
            min-width: 232px;
            width: 232px;
            box-shadow: 0 4px 60px rgb(0 0 0 / 50%);
          }
        `}
      </style>
    </ContentHeader>
  );
};
