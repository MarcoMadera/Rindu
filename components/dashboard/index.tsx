import { useEffect, useState } from "react";
import { PlaylistItem } from "../../lib/types";
import useAuth from "../../hooks/useAuth";
import useSpotify from "../../hooks/useSpotify";
import PlaylistCard from "./PlaylistCard";
import TracksModal from "./TracksModal";

const Dashboard: React.FC = () => {
  const { accessToken, user } = useAuth();
  const { getPlaylists, allTracks } = useSpotify(accessToken);
  const { playlists, totalPlaylists } = useSpotify(accessToken);
  const [selectedCard, setSelectedCard] = useState<{
    playlistId: string | undefined;
    snapshot_id: string | undefined;
  }>({ playlistId: undefined, snapshot_id: undefined });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [offset, setOffSet] = useState<number>(0);

  useEffect(() => {
    getPlaylists(0, 10);
    setOffSet((value) => value + 10);
  }, [getPlaylists]);

  function loadMorePlaylist(e: { preventDefault: () => void }) {
    e.preventDefault();
    setOffSet((value) => value + 10);
    getPlaylists(offset, 10);
  }

  return (
    <>
      {isModalOpen && playlists.length > 0 ? (
        <TracksModal
          setIsModalOpen={setIsModalOpen}
          allTracks={allTracks}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
      ) : null}
      <main>
        <h1>Escoge una playlist</h1>
        <section>
          {playlists.length > 0
            ? playlists.map(
                ({
                  images,
                  name,
                  isPublic,
                  tracks,
                  description,
                  id,
                  snapshot_id,
                  owner,
                }: PlaylistItem) => {
                  if (owner !== user?.id) {
                    return null;
                  }
                  return (
                    <PlaylistCard
                      key={id}
                      images={images}
                      name={name}
                      isPublic={isPublic}
                      tracks={tracks}
                      description={description}
                      snapshot_id={snapshot_id}
                      playlistId={id}
                      setSelectedCard={setSelectedCard}
                      setIsModalOpen={setIsModalOpen}
                    />
                  );
                }
              )
            : null}
        </section>
        {totalPlaylists > playlists.length && (
          <button onClick={loadMorePlaylist}>Cargar más playlists</button>
        )}
      </main>
      <style jsx>{`
        main {
          text-align: center;
        }
        h1 {
          color: #eb5757;
          text-align: center;
          font-size: 48px;
          font-weight: bold;
          margin: 0;
        }
        section {
          display: grid;
          grid-template-columns: repeat(auto-fit, 200px);
          -moz-column-gap: 30px;
          column-gap: 30px;
          row-gap: 34px;
          margin: 20px 140px 50px 140px;
          justify-content: space-between;
        }
        button {
          min-width: 200px;
          padding: 10px;
          border: none;
          background-color: #181818;
          color: #e5e5e5;
          font-size: 18px;
          font-family: inherit;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};
export default Dashboard;
