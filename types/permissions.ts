export enum Permission {
  ConnectDevices = "connect_devices",
  PictureInPictureLyrics = "picture_in_picture_lyrics",
  PlayAsNextInQueue = "play_as_next_in_queue",
  RemovingFromContextTracks = "removing_from_context_tracks",
  RemovingFromNextTracks = "removing_from_next_tracks",
  Resuming = "resuming",
  Pausing = "pausing",
  Seeking = "seeking",
  PeekingPrev = "peeking_prev",
  PeekingNext = "peeking_next",
  SettingPlaybackSpeed = "setting_playback_speed",
  SkippingPrev = "skipping_prev",
  SkippingNext = "skipping_next",
  UpdatingContext = "updating_context",
  TogglingRepeatContext = "toggling_repeat_context",
  TogglingRepeatTrack = "toggling_repeat_track",
  TogglingSuffle = "toggling_shuffle",
}

export enum UserRole {
  Visitor = "visitor",
  Free = "free",
  Open = "open",
  Premium = "premium",
  Admin = "admin",
}

export type FeatureAccess =
  | {
      granted: true;
    }
  | {
      granted: false;
      restrictedReason: string;
    };
