import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import PlaylistCard from "./PlaylistCard";

export default function Dashboard() {
  const { accessToken } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [totalPlaylists, setTotalPlaylists] = useState();

  // const [allTracks,setAllTracks] = useState([]);
  // const findDuplicateSongs= (allTracks) => {
  //   let mapArray = allTracks.map(({ track }, i) => ({ track, i }));
  //   let sortedArraybyValue = mapArray.sort((a, b) =>
  //     a.track.uri > b.track.uri ? 1 : b.track.uri > a.track.uri ? -1 : 0
  //   );
  //   return sortedArraybyValue
  //     .filter(({ track }, i) => {
  //       if (i === sortedArraybyValue.length - 1) {
  //         return false;
  //       }
  //       return track.uri === sortedArraybyValue[i + 1].track.uri;
  //     })
  //     .map(({ i }) => i);
  // };

  useEffect(() => {
    if (accessToken) {
      fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      })
        .then((d) => d.json())
        .then(({ items, total }) => {
          setPlaylists(items);
          setTotalPlaylists(total);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [accessToken]);

  return (
    <>
      <p>
        Mostrando {playlists.length} de {totalPlaylists}
      </p>
      <div>
        {playlists.length > 0
          ? playlists.map(
              ({
                images,
                name,
                public: noPrivate,
                tracks,
                description,
                id,
              }) => {
                return (
                  <PlaylistCard
                    key={id}
                    images={images}
                    name={name}
                    noPrivate={noPrivate}
                    tracks={tracks}
                    description={description}
                  />
                );
              }
            )
          : null}
        <style jsx>{`
          div {
            display: grid;
            grid-template-columns: repeat(auto-fit, 264px);
            -moz-column-gap: 30px;
            column-gap: 30px;
            row-gap: 75px;
            margin: 0 80px 50px 80px;
            justify-content: space-between;
          }
        `}</style>
      </div>
    </>
  );
}
