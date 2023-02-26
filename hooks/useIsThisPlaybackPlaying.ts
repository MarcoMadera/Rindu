import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ITrack } from "types/spotify";
import useSpotify from "./useSpotify";

interface IUseIsThisPlaybackPlaying {
  track?: ITrack;
  trackId?: string | null;
  uri?: string;
  isSingle?: boolean;
  uriId?: string;
  allTracksToPlay?: ITrack[];
}

export default function useIsThisPlaybackPlaying({
  trackId,
  uri,
  isSingle,
  uriId,
  allTracksToPlay,
  track,
}: IUseIsThisPlaybackPlaying): boolean {
  const [isThisTrackPlaying, setIsThisTrackPlaying] = useState(false);
  const [isThisPlaylistPlaying, setIsThisPlaylistPlaying] = useState(false);
  const [isThisArtistPlaying, setIsThisArtistPlaying] = useState(false);
  const [isThisStationPlaying, setIsThisStationPlaying] = useState(false);
  const [isThisConcertPlaying, setIsThisConcertPlaying] = useState(false);
  const { isPlaying, currentlyPlaying, playlistPlayingId, allTracks } =
    useSpotify();
  const router = useRouter();
  const isStationTrack = router.pathname.includes("/station/track/");
  const isConcert = router.pathname.includes("/concert/");
  const stationTrackId = isStationTrack
    ? (router.query.trackId as string)
    : trackId;
  const concertId = isConcert ? (router.query.id as string) : uriId;

  useEffect(() => {
    const updateIsThisTrackPlaying = () => {
      if (trackId) {
        const isTheSameTrackAsPlaying = trackId === currentlyPlaying?.id;
        setIsThisTrackPlaying(isTheSameTrackAsPlaying && isPlaying);
      }
    };

    const updateIsThisArtistPlaying = () => {
      const isTheSameArtistPlaying =
        uri === currentlyPlaying?.artists?.[0]?.uri;
      setIsThisArtistPlaying(isTheSameArtistPlaying && isPlaying);
    };

    const updateIsThisPlaylistPlaying = () => {
      const isTheSamePlaylistPlaying = !!(
        playlistPlayingId &&
        playlistPlayingId === uriId &&
        !isSingle
      );
      setIsThisPlaylistPlaying(isTheSamePlaylistPlaying && isPlaying);
    };

    const updateIsThisStationPlaying = () => {
      const stationTrackIdIsInAllTracks = allTracksToPlay
        ?.map((track) => track.id)
        ?.includes(stationTrackId as string);
      const stationTrackIdIsInAllTracksFromSpotify = allTracks
        ?.map((track) => track.id)
        ?.includes(stationTrackId as string);
      const isTheSameTracksPlaying =
        allTracksToPlay?.join("") === allTracks?.join("");
      const isTheSameStationTracks = !!(
        stationTrackIdIsInAllTracks &&
        stationTrackIdIsInAllTracksFromSpotify &&
        isTheSameTracksPlaying
      );
      const isTheSameStationPlaying =
        !playlistPlayingId || playlistPlayingId === stationTrackId;
      setIsThisStationPlaying(
        isTheSameStationPlaying && isTheSameStationTracks && isPlaying
      );
    };

    const updateIsThisConcertPlaying = () => {
      const isTheSameConcertTracks = !!allTracksToPlay
        ?.map((track) => track.id)
        .includes(currentlyPlaying?.id);
      const isTheSameConcertPlaying =
        !playlistPlayingId ||
        (playlistPlayingId === concertId && isTheSameConcertTracks);
      setIsThisConcertPlaying(isTheSameConcertPlaying && isPlaying);
    };

    updateIsThisTrackPlaying();
    updateIsThisArtistPlaying();
    updateIsThisPlaylistPlaying();
    updateIsThisStationPlaying();
    updateIsThisConcertPlaying();
  }, [
    allTracks,
    allTracksToPlay,
    concertId,
    currentlyPlaying?.artists,
    currentlyPlaying?.id,
    isPlaying,
    isSingle,
    playlistPlayingId,
    stationTrackId,
    trackId,
    uri,
    uriId,
  ]);

  return (
    (isThisTrackPlaying && !isThisPlaylistPlaying) ||
    isThisArtistPlaying ||
    (isThisPlaylistPlaying &&
      !isThisArtistPlaying &&
      !isThisTrackPlaying &&
      !track) ||
    isThisStationPlaying ||
    isThisConcertPlaying
  );
}
