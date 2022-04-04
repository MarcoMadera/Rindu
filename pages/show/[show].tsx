import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { ContentHeader } from "components/forPlaylistsPage/ContentHeader";
import { decode } from "html-entities";
import formatNumber from "utils/formatNumber";
import Link from "next/link";
import ThreeDots from "components/icons/ThreeDots";
import Add from "components/icons/Add";
import { Pause, Play } from "components/icons";
import { useEffect, useState } from "react";
import { ExplicitSign } from "components/forPlaylistsPage/CardTrack";
import { formatTime } from "utils/formatTime";
import { getTimeAgo } from "utils/getTimeAgo";
import { getAuth } from "utils/getAuth";
import { serverRedirect } from "utils/serverRedirect";
import { getShow } from "utils/spotifyCalls/getShow";
import useHeader from "hooks/useHeader";
import { getMainColorFromImage } from "utils/getMainColorFromImage";

function Header({ show }: { show: SpotifyApi.SingleShowResponse | null }) {
  const showName = show?.name ?? "";
  return (
    <ContentHeader>
      <img src={show?.images[1].url} alt="" />
      <div className="playlistInfo">
        <h2>PODCAST</h2>
        <h1>{show?.name}</h1>
        <p className="description">{decode(show?.publisher)}</p>
        <div>
          <p>
            <span>{formatNumber(show?.episodes?.total ?? 0)} episodes</span>
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
            font-size: ${showName.length < 18
              ? "96px"
              : showName.length < 30
              ? "72px"
              : "48px"};
            line-height: ${showName.length < 20
              ? "96px"
              : showName.length < 30
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
            border-radius: 16px;
          }
        `}
      </style>
    </ContentHeader>
  );
}

interface PlaylistProps {
  show: SpotifyApi.SingleShowResponse | null;
  accessToken?: string;
  user: SpotifyApi.UserObjectPrivate | null;
}

function EpisodeCard({ item }: { item: SpotifyApi.EpisodeObjectSimplified }) {
  const [currrentlyPlaying, setCurrrentlyPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { setHeaderColor } = useHeader();

  useEffect(() => {
    setCurrrentlyPlaying(false);
    setIsPlaying(false);
  }, []);

  return (
    <div className="episodeCard">
      <div className="coverImage">
        <div>
          <img
            src={item.images[1].url}
            alt={item.name}
            id="cover-image"
            onLoad={() => {
              setHeaderColor(
                (prev) => getMainColorFromImage("cover-image") ?? prev
              );
            }}
          />
        </div>
      </div>
      <div className="header">
        <Link href={`/episode/${item.id}`}>
          <a>
            <h4>{item.name}</h4>
          </a>
        </Link>
      </div>
      <div className="description">
        <p>{item.description}</p>
      </div>
      <div className="metadata">
        <div>
          <p>
            {item.explicit ? <ExplicitSign /> : null}{" "}
            {getTimeAgo(+new Date(item.release_date), "en")}
          </p>
          <p>
            <span>{formatTime(item.duration_ms / 1000)}</span>
          </p>
        </div>
      </div>
      <div className="topActions">
        <button>
          <ThreeDots fill="#b3b3b3" width={24} height={24} />
        </button>
      </div>
      <div className="actions">
        <button>
          <Add fill="#b3b3b3" />
        </button>
        <button>
          <Add fill="#b3b3b3" />
        </button>
      </div>
      <div className="play">
        <button>{currrentlyPlaying && isPlaying ? <Pause /> : <Play />}</button>
      </div>
      <style jsx>{`
        .episodeCard {
          align-items: center;
          display: grid;
          grid-template-areas:
            "coverImage header header header topActions"
            "coverImage description description description description"
            "coverImage play metadata actions actions";
          grid-template-columns: min-content min-content 1fr min-content;
          grid-template-rows: auto;
          border-radius: 4px;
          color: #b3b3b3;
          cursor: pointer;
          margin: 0px -16px;
          padding: 16px;
          max-width: 700px;
        }
        .episodeCard:hover,
        .episodeCard:focus-within {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .coverImage {
          grid-area: coverImage;
          align-self: flex-start;
        }
        .coverImage img {
          box-shadow: rgb(0 0 0 / 50%) 0px 4px 60px;
          height: 100%;
          width: 100%;
          border-radius: 8px;
          object-fit: cover;
          object-position: center center;
        }
        .coverImage div {
          margin: 0px 24px 0px 0px;
          width: 112px;
          height: 112px;
        }
        .header {
          grid-area: header;
          align-items: flex-start;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .header a {
          color: #fff;
          text-decoration: none;
        }
        .header h4 {
          align-items: center;
          display: flex;
          overflow: hidden;
          padding: 0px;
          line-height: 24px;
          word-break: break-word;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: normal;
          margin: 0;
        }
        .description {
          grid-area: description;
        }
        .description p {
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          margin: 12px 0px;
          overflow: hidden;
          padding: 0px;
          word-break: break-word;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: normal;
          line-height: 16px;
          text-transform: none;
        }
        .metadata {
          grid-area: metadata;
          margin: 0px 0px 0px 16px;
          display: flex;
          gap: 8px;
        }
        .metadata div {
          align-items: center;
          color: rgba(255, 255, 255, 0.6);
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
        }
        .metadata p {
          font-size: 14px;
          font-weight: 400;
          letter-spacing: normal;
          line-height: 14px;
          text-transform: none;
          margin: 0px;
        }
        .metadata div p:nth-of-type(2)::before {
          content: "·";
          margin: 0px 4px;
        }
        .metadata span {
          color: rgba(255, 255, 255, 0.7);
          white-space: nowrap;
        }
        .topActions {
          grid-area: topActions;
          display: flex;
          justify-content: flex-end;
        }
        .topActions button {
          opacity: 0;
          background: transparent;
          border: 0;
          padding: 0;
          font-family: "Lato";
        }
        .episodeCard:hover .topActions button {
          opacity: 1;
        }
        .actions {
          grid-area: actions;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        .actions button {
          background-color: transparent;
          border: 0;
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          padding: 0;
          opacity: 0;
          font-family: "Lato";
        }
        .episodeCard:hover .actions button {
          opacity: 1;
        }
        .actions button:nth-of-type(1) {
          margin: 0px 24px 0px 0px;
          font-weight: 700;
          border-radius: 500px;
          display: inline-block;
          position: relative;
          text-align: center;
          text-decoration: none;
          box-sizing: border-box;
          transition-property: background-color, border-color, color, box-shadow,
            filter, transform;
          user-select: none;
          vertical-align: middle;
          transform: translate3d(0px, 0px, 0px);
          color: #575757;
        }
        .play {
          grid-area: play;
        }
        .play button {
          border-radius: 50%;
          background-color: #fff;
          border: none;
          display: flex;
          font-size: 8px;
          justify-content: center;
          height: 32px;
          min-height: 32px;
          min-width: 32px;
          width: 32px;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
}

const Playlist: NextPage<PlaylistProps> = ({ show }) => {
  return (
    <main>
      <Header show={show} />
      <section>
        {show?.episodes.items.map((item) => {
          return <EpisodeCard key={item.id} item={item} />;
        })}
      </section>
      <style jsx>{`
        main {
          display: block;
          margin: -60px auto 0 auto;
          height: calc(100vh - 90px);
          width: calc(100vw - 245px);
        }
        section {
          padding: 50px;
        }
      `}</style>
    </main>
  );
};

export default Playlist;

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
