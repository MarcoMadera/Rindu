import { PropsWithChildren, ReactElement } from "react";

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
  return (
    <div id="root">
      <div id="tracksModal" />
      <div id="toast" />
      <div id="contextMenu" />
      <ToastContext.Provider
        value={{ toasts: [], ...value } as ToastContextProviderProps}
      >
        <UserContext.Provider
          value={
            {
              user: user,
              accessToken,
              isLogin: true,
              ...value,
            } as IUserContext
          }
        >
          <HeaderContext.Provider
            value={
              {
                alwaysDisplayColor: true,
                headerColor: "#ccc",
                element: null,
                disableBackground: true,
                disableOpacityChange: true,
                displayOnFixed: true,
                ...value,
              } as IHeaderContext
            }
          >
            <SpotifyContext.Provider
              value={
                {
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
                } as ISpotifyContext
              }
            >
              <ContextMenuContext.Provider
                value={
                  {
                    contextMenuData: {
                      data: track,
                      position: { x: 0, y: 0 },
                      type: "cardTrack",
                    },
                    ...value,
                  } as ContextMenuContextProviderProps
                }
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
