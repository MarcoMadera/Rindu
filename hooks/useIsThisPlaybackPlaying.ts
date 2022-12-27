import { useEffect, useState } from "react";
import useSpotify from "./useSpotify";

interface IUseIsThisPlaybackPlaying {
  trackId?: string | null;
  uri?: string;
  isSingle?: boolean;
  uriId?: string;
}

export default function useIsThisPlaybackPlaying({
  trackId,
  uri,
  isSingle,
  uriId,
}: IUseIsThisPlaybackPlaying): {
  isThisTrackPlaying: boolean;
  isThisPlaylistPlaying: boolean;
  isThisArtistPlaying: boolean;
} {
  const [isThisTrackPlaying, setIsThisTrackPlaying] = useState(false);
  const [isThisPlaylistPlaying, setIsThisPlaylistPlaying] = useState(false);
  const [isThisArtistPlaying, setIsThisArtistPlaying] = useState(false);
  const { isPlaying, currentlyPlaying, playlistPlayingId } = useSpotify();

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

    updateIsThisTrackPlaying();
    updateIsThisArtistPlaying();
    updateIsThisPlaylistPlaying();
  }, [
    currentlyPlaying?.artists,
    currentlyPlaying?.id,
    isPlaying,
    isSingle,
    playlistPlayingId,
    trackId,
    uri,
    uriId,
  ]);

  return {
    isThisTrackPlaying,
    isThisPlaylistPlaying,
    isThisArtistPlaying,
  };
}
