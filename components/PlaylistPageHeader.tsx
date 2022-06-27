import React, { Fragment, useEffect, useRef, useState } from "react";
import { decode } from "html-entities";
import Link from "next/link";
import formatNumber from "utils/formatNumber";
import { ContentHeader } from "./forPlaylistsPage/ContentHeader";
import useHeader from "hooks/useHeader";
import { getMainColorFromImage } from "utils/getMainColorFromImage";
import { formatTime } from "utils/formatTime";
import { HeaderType, normalTrackTypes } from "types/spotify";
import { getYear } from "utils/getYear";
import { useRouter } from "next/router";

interface PageHeaderDefault {
  title: string;
  description?: string;
  coverImg: string;
}

type HeaderProps =
  | (PageHeaderDefault & {
      type:
        | HeaderType.album
        | HeaderType.single
        | HeaderType.compilation
        | never;
      artists: SpotifyApi.ArtistObjectSimplified[];
      release_date: string;
      totalTracks: number;
      duration_s?: never;
      ownerId?: never;
      ownerDisplayName?: never;
      totalFollowers?: never;
      popularity?: never;
      totalPublicPlaylists?: never;
      data?: never;
      banner?: never;
      disableOpacityChange?: never;
    })
  | (PageHeaderDefault & {
      type: HeaderType.profile | never;
      totalPublicPlaylists: number;
      totalFollowers: number;
      totalTracks?: never;
      artists?: never;
      release_date?: never;
      duration_s?: never;
      ownerId?: never;
      ownerDisplayName?: never;
      popularity?: never;
      data?: never;
      banner?: never;
      disableOpacityChange?: never;
    })
  | (PageHeaderDefault & {
      type: HeaderType.artist | never;
      popularity: number;
      totalFollowers: number;
      banner?: string;
      totalTracks?: never;
      artists?: never;
      release_date?: never;
      duration_s?: never;
      ownerId?: never;
      ownerDisplayName?: never;
      totalPublicPlaylists?: never;
      data?: never;
      disableOpacityChange?: boolean;
    })
  | (PageHeaderDefault & {
      type: HeaderType.song | never;
      artists: SpotifyApi.ArtistObjectSimplified[];
      release_date: string;
      duration_s: number;
      ownerId?: never;
      ownerDisplayName?: never;
      totalTracks?: never;
      totalFollowers?: never;
      popularity?: never;
      totalPublicPlaylists?: never;
      data: normalTrackTypes | null;
      banner?: never;
      disableOpacityChange?: never;
    })
  | (PageHeaderDefault & {
      type: HeaderType.episode | never;
      ownerId: string;
      ownerDisplayName: string;
      artists?: never;
      duration_s?: never;
      release_date?: never;
      totalTracks?: never;
      totalFollowers?: never;
      popularity?: never;
      totalPublicPlaylists?: never;
      data?: never;
      banner?: never;
      disableOpacityChange?: never;
    })
  | (PageHeaderDefault & {
      type: HeaderType.playlist | never;
      ownerId: string;
      ownerDisplayName: string;
      totalFollowers: number;
      totalTracks: number;
      artists?: never;
      duration_s?: never;
      release_date?: never;
      popularity?: never;
      totalPublicPlaylists?: never;
      data?: never;
      banner?: never;
      disableOpacityChange?: never;
    })
  | (PageHeaderDefault & {
      type: HeaderType;
      ownerId: string;
      ownerDisplayName: string;
      totalTracks?: never;
      totalFollowers?: never;
      artists?: never;
      release_date?: never;
      duration_s?: never;
      popularity?: never;
      totalPublicPlaylists?: never;
      data?: never;
      banner?: never;
      disableOpacityChange?: never;
    });

export const PlaylistPageHeader: React.FC<HeaderProps> = ({
  type,
  coverImg,
  title,
  description,
  artists,
  ownerId,
  ownerDisplayName,
  totalTracks,
  duration_s,
  totalFollowers,
  release_date,
  popularity,
  totalPublicPlaylists,
  data,
  banner,
  disableOpacityChange,
}) => {
  const { setHeaderColor } = useHeader({ disableOpacityChange });
  const image = useRef<HTMLImageElement>(null);
  const [imageIsLoaded, setImageIsLoaded] = useState(false);
  const router = useRouter();

  const isAlbumVariant =
    type === HeaderType.album ||
    type === HeaderType.single ||
    type === HeaderType.compilation;

  useEffect(() => {
    if (banner) return;
    if (image.current?.complete || imageIsLoaded) {
      setHeaderColor((prev) => getMainColorFromImage("cover-image") ?? prev);
    }
  }, [banner, imageIsLoaded, router.asPath, setHeaderColor]);

  return (
    <ContentHeader
      banner={banner}
      data={data ?? null}
      disableOpacityChange={disableOpacityChange}
    >
      {coverImg && !banner ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImg}
          ref={image}
          alt=""
          id="cover-image"
          onLoad={() => {
            if (banner) return;
            setHeaderColor(
              (prev) => getMainColorFromImage("cover-image") ?? prev
            );
            setImageIsLoaded(true);
          }}
        />
      ) : (
        !banner && <div id="cover-image"></div>
      )}
      <div className="playlistInfo">
        <h2>{type}</h2>
        <h1>{title}</h1>
        {description ? (
          <p className="description">{decode(description)}</p>
        ) : null}
        <div>
          <p>
            {type === HeaderType.song || isAlbumVariant ? (
              <span className="trackArtists">
                {artists &&
                  artists?.map((artist, i) => {
                    return (
                      <Fragment key={artist.id}>
                        <Link href={`/artist/${artist.id}`}>
                          <a className="userLink">{artist.name}</a>
                        </Link>
                        {i !== (artists?.length && artists?.length - 1)
                          ? ", "
                          : null}
                      </Fragment>
                    );
                  })}
              </span>
            ) : type === HeaderType.podcast ? (
              <h2 className="singleDisplayName">{decode(ownerDisplayName)}</h2>
            ) : (
              ownerDisplayName && (
                <Link
                  href={`/${
                    type === HeaderType.episode ? "show" : "user"
                  }/${ownerId}`}
                >
                  <a className="userLink">{decode(ownerDisplayName)}</a>
                </Link>
              )
            )}
            {(totalFollowers ?? 0) > 0 ? (
              <span>
                {!(
                  type === HeaderType.profile || type === HeaderType.artist
                ) ? (
                  <>&nbsp;&middot;</>
                ) : (
                  ""
                )}{" "}
                {formatNumber(totalFollowers ?? 0)} followers
              </span>
            ) : null}
            {(type === HeaderType.song || isAlbumVariant) && release_date ? (
              <>
                <span>&nbsp;&middot; {getYear(release_date)}</span>
                {type === HeaderType.song && duration_s ? (
                  <span>
                    &nbsp;&middot; {formatTime(duration_s ?? 0)} minutos
                  </span>
                ) : null}
              </>
            ) : null}
            {totalTracks ? (
              <span>
                &nbsp;&middot; {formatNumber(totalTracks ?? 0)}{" "}
                {totalTracks === 1 ? "song" : "songs"}
              </span>
            ) : null}
            {popularity ? (
              <span>
                &nbsp;&middot; {formatNumber(popularity ?? 0)} popularity
              </span>
            ) : null}
            {totalPublicPlaylists ? (
              <span>
                &nbsp;&middot; {formatNumber(totalPublicPlaylists)} playlists
                publicas
              </span>
            ) : null}
          </p>
        </div>
      </div>
      <style jsx>
        {`
          div h1,
          div h2,
          div p {
            padding: ${banner ? "0px 0 15px 10px" : "0.08em 0px"};
          }
          h1 {
            color: #fff;
            margin: 0;
            pointer-events: none;
            user-select: none;
            font-size: ${title.length < 16
              ? "96px"
              : title.length < 21
              ? "72px"
              : title.length < 30
              ? "64px"
              : "48px"};
            line-height: ${title.length < 20
              ? "96px"
              : title.length < 30
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
            z-index: 13232;
          }
          h2 {
            font-size: 12px;
            margin-top: 4px;
            margin-bottom: 0;
            font-weight: 700;
          }
          .singleDisplayName {
            font-size: 24px;
            font-weight: 700;
            line-height: 28px;
            color: #fff;
          }
          div.playlistInfo {
            align-self: flex-end;
            width: calc(100% - 310px);
            text-shadow: ${banner ? "0px 0px 20px #00000078" : "none"};
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
          #cover-image {
            margin-right: 15px;
            align-self: center;
            align-self: flex-end;
            height: 232px;
            margin-inline-end: 24px;
            min-width: 232px;
            width: 232px;
            box-shadow: 0 4px 60px rgb(0 0 0 / 50%);
            border-radius: ${type === HeaderType.artist ||
            type === HeaderType.profile
              ? "50%"
              : type === HeaderType.episode || type === HeaderType.podcast
              ? "12px"
              : "0px"};
            object-fit: cover;
            object-position: center center;
          }
        `}
      </style>
    </ContentHeader>
  );
};
