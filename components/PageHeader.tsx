import React, { Fragment, ReactElement, useEffect } from "react";
import { decode } from "html-entities";
import Link from "next/link";
import formatNumber from "utils/formatNumber";
import PageDetails from "./PageDetails";
import useHeader from "hooks/useHeader";
import { getMainColorFromImage } from "utils/getMainColorFromImage";
import { formatTime } from "utils/formatTime";
import { HeaderType } from "types/pageHeader";
import { getYear } from "utils/getYear";
import { useRouter } from "next/router";
import { HeaderProps } from "types/pageHeader";
import Heading from "./Heading";
import { Eyebrow } from "./Eyebrow";
import { AsType } from "types/heading";

export default function PageHeader({
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
}: HeaderProps): ReactElement {
  const { setHeaderColor } = useHeader({ disableOpacityChange });
  const router = useRouter();

  const isAlbumVariant =
    type === HeaderType.album ||
    type === HeaderType.single ||
    type === HeaderType.compilation;

  useEffect(() => {
    if (banner) return;
    getMainColorFromImage("cover-image", setHeaderColor);
  }, [banner, router.asPath, setHeaderColor]);

  return (
    <PageDetails
      banner={banner}
      data={data ?? null}
      disableOpacityChange={disableOpacityChange}
    >
      {coverImg && !banner ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverImg} alt="" id="cover-image" />
      ) : (
        !banner && <div id="cover-image"></div>
      )}
      <div className="playlistInfo">
        <Eyebrow>{type}</Eyebrow>
        <Heading
          number={1}
          fontSize={
            title.length < 16
              ? "96px"
              : title.length < 21
              ? "72px"
              : title.length < 30
              ? "64px"
              : "48px"
          }
        >
          {title}
        </Heading>
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
              <Heading number={3} as={AsType.SPAN}>
                {decode(ownerDisplayName)}
              </Heading>
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
          div.playlistInfo {
            align-self: flex-end;
            text-shadow: ${banner ? "0px 0px 20px #00000078" : "none"};
            margin-right: 50px;
            width: 100%;
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
    </PageDetails>
  );
}
