import { PropsWithChildren, ReactElement, useMemo } from "react";

import { ContextMenu } from "components";
import ContextMenuContext from "context/ContextMenuContext";
import HeaderContext, { IHeaderContext } from "context/HeaderContext";
import SpotifyContext from "context/SpotifyContext";
import ToastContext, { ToastContextProviderProps } from "context/ToastContext";
import UserContext, { IUserContext } from "context/UserContext";
import { ContextMenuContextProviderProps } from "types/contextMenu";
import { ISpotifyContext } from "types/spotify";
// eslint-disable-next-line jest/no-mocks-import
import {
  accessToken,
  simplePlaylist,
  track,
  trackFull,
  user,
} from "utils/__tests__/__mocks__/mocks";

type AppContext = IUserContext &
  ISpotifyContext &
  IHeaderContext &
  ToastContextProviderProps;

interface ContextValues {
  value: Partial<AppContext>;
}

export const AppProviders = ({
  children,
  value,
}: PropsWithChildren<Partial<ContextValues>>): ReactElement => {
  const toastValue = useMemo(() => ({ toasts: [], ...value }), [value]);
  const userValue = useMemo(
    () => ({ user, accessToken, isLogin: true, ...value }),
    [value]
  );
  const headerValue = useMemo(
    () => ({
      alwaysDisplayColor: true,
      headerColor: "#ccc",
      element: null,
      disableBackground: true,
      disableOpacityChange: true,
      displayOnFixed: true,
      ...value,
    }),
    [value]
  );
  const spotifyValue = useMemo(
    () => ({
      deviceId: "deviceId",
      playlists: [simplePlaylist],
      allTracks: [trackFull],
      currentlyPlaying: track,
      isPlaying: false,
      currentlyPlayingDuration: 4000,
      currentlyPlayingPosition: 30,
      isPip: false,
      isShowingSideBarImg: true,
      lastVolume: 0.5,
      pageDetails: {},
      playedSource: "",
      totalPlaylists: 1,
      player: {
        disconnect: () => {
          console.log("disconnect");
        },
      },
      ...value,
    }),
    [value]
  );
  const contextMenuValue = useMemo(
    () => ({
      contextMenuData: {
        data: track,
        position: { x: 0, y: 0 },
        type: "cardTrack",
      },
      ...value,
    }),
    [value]
  );

  return (
    <div id="root">
      <div id="tracksModal" />
      <div id="toast" />
      <div id="contextMenu" />
      <ToastContext.Provider value={toastValue as ToastContextProviderProps}>
        <UserContext.Provider value={userValue as IUserContext}>
          <HeaderContext.Provider value={headerValue as IHeaderContext}>
            <SpotifyContext.Provider value={spotifyValue as ISpotifyContext}>
              <ContextMenuContext.Provider
                value={contextMenuValue as ContextMenuContextProviderProps}
              >
                <ContextMenu />
                {children}
              </ContextMenuContext.Provider>
            </SpotifyContext.Provider>
          </HeaderContext.Provider>
        </UserContext.Provider>
      </ToastContext.Provider>
    </div>
  );
};
