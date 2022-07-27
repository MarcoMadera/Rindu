import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { getAuth } from "utils/getAuth";
import { serverRedirect } from "utils/serverRedirect";
import { getShow } from "utils/spotifyCalls/getShow";
import { ITrack } from "types/spotify";
import { HeaderType } from "types/pageHeader";
import { getSiteUrl } from "utils/enviroment";
import PageHeader from "components/PageHeader";
import { PlayButton } from "components/PlayButton";
import { Heart } from "components/icons/Heart";
import { removeShowsFromLibrary } from "utils/spotifyCalls/removeShowsFromLibrary";
import { saveShowsToLibrary } from "utils/spotifyCalls/saveShowsToLibrary";
import useAuth from "hooks/useAuth";
import { checkIfUserFollowShows } from "utils/spotifyCalls/checkIfUserFollowShows";
import useSpotify from "hooks/useSpotify";
import PlaylistTopBarExtraField from "components/PlaylistTopBarExtraField";
import useHeader from "hooks/useHeader";
import useToast from "hooks/useToast";
import EpisodeCard from "components/EpisodeCard";
import ContentContainer from "components/ContentContainer";
import Heading from "components/Heading";

interface PlaylistProps {
  show: SpotifyApi.SingleShowResponse | null;
  accessToken?: string;
  user: SpotifyApi.UserObjectPrivate | null;
}

const Shows: NextPage<PlaylistProps> = ({ show, accessToken, user }) => {
  const [isShowInLibrary, setIsShowInLibrary] = useState(false);
  const { setAccessToken, setUser } = useAuth();
  const { setPageDetails, setAllTracks } = useSpotify();
  const { addToast } = useToast();
  const { setElement } = useHeader({
    showOnFixed: false,
  });
  useEffect(() => {
    setElement(() => <PlaylistTopBarExtraField uri={show?.uri} />);

    setAccessToken(accessToken);

    setUser(user);
  }, [accessToken, setAccessToken, setElement, setUser, show?.uri, user]);

  useEffect(() => {
    async function fetchData() {
      const userFollowThisShow = await checkIfUserFollowShows(
        [show?.id || ""],
        accessToken
      );
      setIsShowInLibrary(!!userFollowThisShow?.[0]);
    }
    fetchData();
  }, [accessToken, show?.id]);

  const allTracks: ITrack[] | undefined = useMemo(
    () =>
      show?.episodes.items.map((episode) => ({
        album: {
          id: show.id,
          name: show.name,
          images: show.images,
          release_date: episode?.release_date,
          type: "album",
          uri: show?.uri,
        },
        artists: [
          {
            name: show.publisher ?? "",
            id: show.id ?? "",
            type: "artist",
            uri: `spotify:show:${show?.id}`,
          },
        ],
        id: episode?.id,
        name: episode?.name,
        duration_ms: episode?.duration_ms ?? 0,
        explicit: episode?.explicit ?? false,
        preview_url: episode?.audio_preview_url,
        position: 1,
        type: "episode",
        uri: episode?.uri,
      })),
    [show]
  );

  useEffect(() => {
    setAllTracks(allTracks ?? []);
  }, [allTracks, setAllTracks]);

  useEffect(() => {
    setPageDetails({
      id: show?.id,
      images: show?.images,
      name: show?.name,
      tracks: {
        total: show?.episodes.total,
      },
      type: "playlist",
      uri: show?.uri,
    });
  }, [setPageDetails, show]);

  return (
    <ContentContainer hasPageHeader>
      <PageHeader
        type={HeaderType.podcast}
        title={show?.name ?? ""}
        coverImg={
          show?.images?.[0]?.url ??
          show?.images?.[1]?.url ??
          `${getSiteUrl()}/defaultSongCover.jpeg`
        }
        ownerDisplayName={show?.publisher ?? ""}
        ownerId={show?.id ?? ""}
      />
      <section>
        <div className="options">
          <PlayButton uri={show?.uri} size={56} centerSize={28} />
          <div className="info">
            <Heart
              active={isShowInLibrary}
              style={{ width: 80, height: 80 }}
              handleLike={async () => {
                if (!show) return null;
                const saveRes = await saveShowsToLibrary([show.id]);
                if (saveRes) {
                  addToast({
                    message: "Podcast added to your library",
                    variant: "success",
                  });
                  return true;
                }
                return null;
              }}
              handleDislike={async () => {
                if (!show) return null;
                const removeRes = await removeShowsFromLibrary([show.id]);
                if (removeRes) {
                  addToast({
                    message: "Podcast removed from your library",
                    variant: "success",
                  });
                  return true;
                }
                return null;
              }}
            />
          </div>
        </div>
        <div className="content">
          <div className="episodes">
            {show?.episodes.items.map((item, i) => {
              return (
                <EpisodeCard
                  key={item.id}
                  item={item}
                  show={show}
                  position={i}
                />
              );
            })}
          </div>
          <div className="description">
            <Heading number={3} as="h2">
              About
            </Heading>
            <p>{show?.description}</p>
          </div>
        </div>
      </section>
      <style jsx>{`
        .content {
          display: grid;
          grid-template-columns: 700px 1fr;
        }
        section {
          margin: 0 32px;
          position: relative;
          z-index: 1;
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
          flex-direction: row;
        }
        p {
          font-size: 1rem;
          line-height: 1.5rem;
          text-transform: none;
          letter-spacing: normal;
          font-weight: 400;
          box-sizing: border-box;
          color: #b3b3b3;
          font-family: "Lato", sans-serif;
        }
      `}</style>
    </ContentContainer>
  );
};

export default Shows;

export async function getServerSideProps({
  params: { show },
  req,
  res,
}: {
  params: { show: string };
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  props: PlaylistProps | null;
}> {
  const cookies = req?.headers?.cookie;
  if (!cookies) {
    serverRedirect(res, "/");
    return { props: null };
  }
  const { accessToken, user } = (await getAuth(res, cookies)) || {};

  const showData = await getShow(show, accessToken);

  return {
    props: {
      show: showData,
      accessToken,
      user: user ?? null,
    },
  };
}
