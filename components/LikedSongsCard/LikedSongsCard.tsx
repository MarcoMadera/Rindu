import { ReactElement, useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { Heading, PlayButton } from "components";
import { useAuth, useSpotify, useTranslations } from "hooks";
import { templateReplace } from "utils";
import { getMyLikedSongs } from "utils/spotifyCalls";

interface ILikedSongsCardProps {
  likedSongs?: SpotifyApi.PlaylistTrackResponse | null;
}

export default function LikedSongsCard({
  likedSongs: likedSongsProps,
}: Readonly<ILikedSongsCardProps>): ReactElement | null {
  const { user } = useAuth();
  const [likedSongs, setLikedSongs] = useState<
    SpotifyApi.PlaylistTrackResponse | null | undefined
  >(likedSongsProps);
  const { allTracks } = useSpotify();
  const router = useRouter();
  const { translations } = useTranslations();

  useEffect(() => {
    if (likedSongs) return;
    async function getLikedSongs() {
      const likedSongs = await getMyLikedSongs(10);
      setLikedSongs(likedSongs);
    }

    getLikedSongs();
  }, [likedSongs]);

  if (!user || !likedSongs) return null;

  const translationDescription =
    likedSongs?.total === 1
      ? translations.pages.collectionPlaylists.likedSongsCardDescriptionSingular
      : translations.pages.collectionPlaylists.likedSongsCardDescriptionPlural;

  return (
    <div className="container-wrapper">
      <div className="container">
        <div className="liked-songs-card">
          <div className="songList">
            <div className="list">
              {likedSongs?.items.map((song, i) => {
                const divider = i === 0 ? "" : " • ";

                return (
                  <span key={song.track?.id}>
                    <span className="divider">{divider}</span>
                    <span className="artistName">
                      {song.track?.artists[0].name}
                    </span>
                    <span className="songName">{song.track?.name}</span>
                  </span>
                );
              })}
            </div>
          </div>
          <div className="titleDesc">
            <Link href={"/collection/tracks"}>
              <Heading number={2}>
                {translations.pages.collectionPlaylists.likedSongsCardTitle}
              </Heading>
            </Link>
            <div className="desc">
              <div>
                {templateReplace(translationDescription, [likedSongs?.total])}
              </div>
            </div>
          </div>
          <div className="playButton">
            <div className="playButton-container">
              <PlayButton
                size={56}
                centerSize={28}
                allTracks={allTracks}
                uri={`spotify:user:${user.id}:collection`}
              />
            </div>
          </div>
          <div
            className="heroCardClickHandler"
            data-testid="heroCardClickHandler"
            role={"button"}
            tabIndex={-1}
            aria-label={
              translations.pages.collectionPlaylists.likedSongsCardTitle
            }
            onKeyDown={(e) => {
              e.preventDefault();
              if (e.key === "Enter") {
                router.push("/collection/tracks");
              }
            }}
            onClick={() => {
              router.push("/collection/tracks");
            }}
          ></div>
        </div>
      </div>
      <style jsx>
        {`
          .container-wrapper {
            grid-column: span 2;
            height: inherit;
            height: 100%;
          }
          .container {
            line-height: 1.6;
            --card-container-border-radius: clamp(
              4px,
              (var(--column-width, 0px) - 32px) * 0.025,
              8px
            );
            background: #181818;
            border-radius: calc(var(--card-container-border-radius) + 2px);
            flex: 1;
            isolation: isolate;
            padding: 20px;
            position: relative;
            transition: background-color 0.3s ease;
            width: 100%;
            color: #fff;
            font-size: 1rem;
            height: inherit;
            background: linear-gradient(149.46deg, #450af5, #8e8ee5 99.16%);
          }
          .liked-songs-card {
            -webkit-box-orient: vertical;
            display: -webkit-box;
            display: flex;
            flex-direction: column;
            gap: 20px;
            height: 100%;
            user-select: none;
          }
          .songList {
            align-items: flex-end;
            display: -webkit-box;
            display: flex;
            flex: 1;
            margin-bottom: 12px;
          }
          .list {
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            display: -webkit-box;
            max-height: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            width: 100%;
          }
          .list .divider {
            opacity: 0.7;
          }
          .list .divider:before {
            content: " ";
          }
          .list .songName {
            opacity: 0.7;
          }
          .list .songName:before {
            content: " ";
          }
          .titleDesc {
            min-height: 62px;
          }
          .titleDesc :global(a) {
            text-decoration: none;
            color: inherit;
            position: relative;
            z-index: 1;
            display: inline-block;
            max-width: 100%;
            vertical-align: middle;
            user-select: none;
          }
          .title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            box-sizing: border-box;
            font-size: 2rem;
            font-weight: 700;
            padding-block-end: 4px;
            color: #fff;
          }
          .desc {
            margin-top: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            white-space: normal;
            box-sizing: border-box;
            font-size: 0.8125rem;
            font-weight: 400;
            color: #6a6a6a;
            font-size: 0.875rem;
          }
          .desc div {
            color: #fff;
            font-size: 1rem;
            text-transform: lowercase;
          }
          .playButton {
            border-radius: 500px;
            bottom: 20px;
            box-shadow: 0 8px 8px rgba(0, 0, 0, 0.3);
            opacity: 0;
            pointer-events: none;
            position: absolute;
            right: 20px;
            transform: translateY(8px);
            transition: all 0.3s ease;
            z-index: 2;
          }
          .playButton-container {
            position: relative;
          }
          .container:hover .playButton {
            opacity: 1;
            pointer-events: auto;
            position: absolute;
            transform: translateY(0);
          }
          .playButton :global(.play-Button) {
            position: relative;
            z-index: 1;
          }
          .heroCardClickHandler {
            bottom: 0;
            content: "";
            cursor: pointer;
            left: 0;
            overflow: hidden;
            position: absolute;
            right: 0;
            text-indent: 100%;
            top: 0;
            white-space: nowrap;
            z-index: 0;
          }

          @media (max-width: 768px) {
            .container-wrapper {
              padding: 0 8px;
            }
          }
        `}
      </style>
    </div>
  );
}
