import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { HeaderType } from "types/pageHeader";
import { ITrack } from "types/spotify";
import { useRouter } from "next/router";
import useAuth from "hooks/useAuth";
import useAnalitycs from "hooks/useAnalytics";
import { useEffect, useState } from "react";
import VirtualizedList from "components/VirtualizedList";
import { Heart } from "components/icons/Heart";
import TrackListHeader from "components/TrackListHeader";
import useSpotify from "hooks/useSpotify";
import { PlayButton } from "components/PlayButton";
import useHeader from "hooks/useHeader";
import PlaylistTopBarExtraField from "components/PlaylistTopBarExtraField";
import { serverRedirect } from "utils/serverRedirect";
import { getAuth } from "utils/getAuth";
import { getAlbumById } from "utils/spotifyCalls/getAlbumById";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";
import { checkIfUserFollowAlbums } from "utils/spotifyCalls/checkIfUserFollowAlbums";
import { unFollowAlbums } from "utils/spotifyCalls/unFollowAlbums";
import { followAlbums } from "utils/spotifyCalls/followAlbums";
import PageHeader from "components/PageHeader";
import { SITE_URL } from "utils/constants";
import useToast from "hooks/useToast";
import ContentContainer from "components/ContentContainer";

interface AlbumPageProps {
  album: SpotifyApi.SingleAlbumResponse | null;
  accessToken?: string;
  user: SpotifyApi.UserObjectPrivate | null;
  tracks: ITrack[] | null;
  tracksInLibrary: boolean[] | null;
}

const AlbumPage: NextPage<AlbumPageProps> = ({
  album,
  user,
  accessToken,
  tracks,
  tracksInLibrary,
}) => {
  const { setIsLogin, setUser, setAccessToken } = useAuth();
  const { trackWithGoogleAnalitycs } = useAnalitycs();
  const { setAllTracks, setPageDetails } = useSpotify();
  const router = useRouter();
  const [isPin, setIsPin] = useState(false);
  const [isFollowingThisAlbum, setIsFollowingThisAlbum] = useState(false);
  const { setElement } = useHeader({
    showOnFixed: false,
  });
  const { addToast } = useToast();

  useEffect(() => {
    async function fetchData() {
      const userFollowThisAlbum = await checkIfUserFollowAlbums(
        [album?.id || ""],
        accessToken
      );
      setIsFollowingThisAlbum(!!userFollowThisAlbum?.[0]);
    }
    fetchData();
  }, [accessToken, album?.id, user?.id]);

  useEffect(() => {
    if (!album) {
      router.push("/");
    }

    setElement(() => <PlaylistTopBarExtraField uri={album?.uri} />);
    trackWithGoogleAnalitycs();

    setIsLogin(true);

    setAccessToken(accessToken);

    setUser(user);

    setAllTracks(tracks ?? []);

    if (!album) {
      return;
    }

    setPageDetails({
      id: album.id,
      uri: album.uri,
      type: "playlist",
      name: album.name,
      tracks: { total: album.tracks.total },
    });
  }, [
    accessToken,
    album,
    router,
    setAccessToken,
    setAllTracks,
    setIsLogin,
    setPageDetails,
    setUser,
    trackWithGoogleAnalitycs,
    tracks,
    user,
    setElement,
  ]);

  return (
    <ContentContainer hasPageHeader>
      <PageHeader
        type={
          album?.album_type === "single"
            ? HeaderType.single
            : album?.album_type === "compilation"
            ? HeaderType.compilation
            : HeaderType.album
        }
        title={album?.name ?? ""}
        coverImg={
          album?.images?.[0]?.url ??
          album?.images?.[1]?.url ??
          `${SITE_URL}/defaultSongCover.jpeg`
        }
        artists={album?.artists ?? []}
        totalTracks={album?.tracks.total ?? 0}
        release_date={album?.release_date ?? "1"}
      />
      <div className="tracksContainer">
        <div className="options">
          <PlayButton uri={album?.uri} size={56} centerSize={28} />
          <div className="info">
            <Heart
              active={isFollowingThisAlbum}
              handleDislike={async () => {
                if (!album) return null;
                const unfollowRes = await unFollowAlbums([album.id]);
                if (unfollowRes) {
                  addToast({
                    message: "Album removed from your library",
                    variant: "success",
                  });
                  return true;
                }
                return null;
              }}
              handleLike={async () => {
                if (!album) return null;
                const followRes = await followAlbums([album.id]);
                if (followRes) {
                  addToast({
                    message: "Album added to your library",
                    variant: "success",
                  });
                  return true;
                }
                return null;
              }}
              style={{ width: 80, height: 80 }}
            />
          </div>
        </div>
        <div className="trc">
          <TrackListHeader type="album" setIsPin={setIsPin} isPin={isPin} />
          <VirtualizedList
            type="album"
            initialTracksInLibrary={tracksInLibrary}
          />
          <div className="copy">
            {album?.copyrights?.map(({ text }, i) => {
              return <p key={i}>{text}</p>;
            })}
          </div>
        </div>
      </div>
      <style jsx>{`
        .copy {
          margin-top: 16px;
          padding-bottom: 24px;
        }
        p {
          font-size: 0.6875rem;
          line-height: 1rem;
          text-transform: none;
          letter-spacing: normal;
          font-weight: 400;
          color: #b3b3b3;
          margin: 0;
        }
        div.info {
          align-self: flex-end;
          width: calc(100% - 310px);
        }
        .info :global(button) {
          margin-left: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: transparent;
          border: none;
        }
        .options {
          display: flex;
          padding: 24px 0;
          position: relative;
          width: 100%;
          align-items: center;
          margin: 16px 0;
          flex-direction: row;
        }
        .options,
        .trc {
          padding: 0 32px;
        }
        .trc {
          margin-bottom: 50px;
        }
      `}</style>
    </ContentContainer>
  );
};

export default AlbumPage;

export async function getServerSideProps({
  params: { albumId },
  req,
  res,
}: {
  params: { albumId: string };
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  props: AlbumPageProps | null;
}> {
  const cookies = req ? req?.headers?.cookie : undefined;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  const album = await getAlbumById(albumId, user?.country ?? "US", accessToken);
  const trackIds = album?.tracks.items.map(({ id }: { id: string }) => id);
  const tracksInLibrary = await checkTracksInLibrary(
    trackIds ?? [],
    accessToken || ""
  );
  const tracks: ITrack[] | undefined = album?.tracks.items.map((track) => {
    const isCorrupted =
      !track?.name && !track?.artists?.[0]?.name && track?.duration_ms === 0;
    return {
      ...track,
      album: {
        images: album.images,
        id: album.id,
        name: album.name,
        uri: album.uri,
      },
      is_local: false,
      corruptedTrack: isCorrupted,
      added_at: album.release_date,
      position: track.track_number - 1,
    };
  });

  return {
    props: {
      album,
      accessToken,
      user: user ?? null,
      tracks: tracks ?? null,
      tracksInLibrary,
    },
  };
}
