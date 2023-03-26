import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { useSpotify } from "hooks";
import { ITrack } from "types/spotify";

interface IUseIsThisPlaybackPlaying {
  track?: ITrack;
  trackId?: string | null;
  uri?: string;
  isSingle?: boolean;
  uriId?: string;
  allTracksToPlay?: ITrack[];
}

export function useIsThisPlaybackPlaying({
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
  const [isLikedTracksPlaying, setIsLikedTracksPlaying] = useState(false);
  const [isSameTracksPlaying, setIsSameTracksPlaying] = useState(false);
  const { isPlaying, currentlyPlaying, playlistPlayingId, allTracks } =
    useSpotify();
  const router = useRouter();
  const isStationTrack = router.pathname.includes("/station/track/");
  const isConcert = router.pathname.includes("/concert/");
  const isLikedTracks = router.pathname.includes("/collection/tracks");
  const stationTrackId = isStationTrack
    ? (router.query.trackId as string)
    : null;
  const concertId = isConcert ? (router.query.id as string) : null;

  useEffect(() => {
    const updateIsThisTrackPlaying = () => {
      if (!trackId) {
        setIsThisTrackPlaying(false);
        return;
      }
      const isTheSameTrackAsPlaying = trackId === currentlyPlaying?.id;
      setIsThisTrackPlaying(isTheSameTrackAsPlaying && isPlaying);
    };

    const updateIsThisArtistPlaying = () => {
      if (!uri) {
        setIsThisArtistPlaying(false);
        return;
      }
      const isTheSameArtistPlaying =
        uri === currentlyPlaying?.artists?.[0]?.uri;
      setIsThisArtistPlaying(isTheSameArtistPlaying && isPlaying);
    };

    const updateIsThisPlaylistPlaying = () => {
      if (!uriId) {
        setIsThisPlaylistPlaying(false);
        return;
      }
      const isTheSamePlaylistPlaying = !!(
        playlistPlayingId &&
        playlistPlayingId === uriId &&
        !isSingle
      );
      setIsThisPlaylistPlaying(isTheSamePlaylistPlaying && isPlaying);
    };

    const updateIsThisStationPlaying = () => {
      if (!stationTrackId) {
        setIsThisStationPlaying(false);
        return;
      }
      const stationTrackIdIsInAllTracks = allTracksToPlay
        ?.map((track) => track.id)
        ?.includes(stationTrackId);
      const stationTrackIdIsInAllTracksFromSpotify = allTracks
        ?.map((track) => track.id)
        ?.includes(stationTrackId);
      const isTheSameTracksPlaying =
        allTracksToPlay?.join("") === allTracks?.join("");
      const nowPlayingIsStationTrack = !!allTracks
        ?.map((track) => track.id)
        ?.includes(currentlyPlaying?.id);
      const isTheSameStationTracks = !!(
        stationTrackIdIsInAllTracks &&
        stationTrackIdIsInAllTracksFromSpotify &&
        isTheSameTracksPlaying &&
        nowPlayingIsStationTrack
      );
      const isTheSameStationPlaying =
        !playlistPlayingId || playlistPlayingId === stationTrackId;
      setIsThisStationPlaying(
        isTheSameStationPlaying && isTheSameStationTracks && isPlaying
      );
    };

    const updateIsThisConcertPlaying = () => {
      if (!concertId) {
        setIsThisConcertPlaying(false);
        return;
      }
      const isTheSameConcertTracks = !!allTracksToPlay
        ?.map((track) => track.id)
        .includes(currentlyPlaying?.id);
      const isTheSameConcertPlaying =
        !playlistPlayingId ||
        (playlistPlayingId === concertId && isTheSameConcertTracks);
      setIsThisConcertPlaying(isTheSameConcertPlaying && isPlaying);
    };

    const updateIsLikedTracksPlaying = () => {
      const isLikedTracksPlaying =
        playlistPlayingId === "tracks" && isPlaying && isLikedTracks;
      setIsLikedTracksPlaying(isLikedTracksPlaying);
    };

    const updateIsSameTracksPlaying = () => {
      if (!allTracksToPlay?.length || !allTracks?.length || uri || uriId) {
        setIsSameTracksPlaying(false);
        return;
      }
      const isTheSameTracksPlaying =
        allTracksToPlay?.join("") === allTracks?.join("");
      const isTrackPlayingInTracks = !!allTracksToPlay
        ?.map((track) => track.id)
        .includes(currentlyPlaying?.id);
      setIsSameTracksPlaying(
        isTheSameTracksPlaying &&
          isTrackPlayingInTracks &&
          !playlistPlayingId &&
          !isSingle &&
          isPlaying
      );
    };

    updateIsSameTracksPlaying();
    updateIsLikedTracksPlaying();
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
    isLikedTracks,
    playlistPlayingId,
    stationTrackId,
    trackId,
    uri,
    uriId,
    router.asPath,
    currentlyPlaying?.uri,
  ]);

  return (
    (isThisTrackPlaying && !isThisPlaylistPlaying) ||
    isThisArtistPlaying ||
    (isThisPlaylistPlaying &&
      !isThisArtistPlaying &&
      !isThisTrackPlaying &&
      !track) ||
    isThisStationPlaying ||
    isThisConcertPlaying ||
    isLikedTracksPlaying ||
    isSameTracksPlaying
  );
}
