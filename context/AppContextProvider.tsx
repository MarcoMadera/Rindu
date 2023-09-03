import { PropsWithChildren, ReactElement, useMemo } from "react";

import { LyricsContextContextProvider } from "./LyricsContextProvider";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import { HeaderContextProvider, IHeaderContext } from "context/HeaderContext";
import { IModalContext, ModalContextProvider } from "context/ModalContext";
import { SpotifyContextProvider } from "context/SpotifyContext";
import { IToastContext, ToastContextProvider } from "context/ToastContext";
import TranslationsContext, {
  TranslationsContextProviderProps,
} from "context/TranslationsContext";
import { IUserContext, UserContextProvider } from "context/UserContext";
import { IContextMenuContext } from "types/contextMenu";
import { ISpotifyContext } from "types/spotify";

interface AppContextProviderProps {
  toastValue?: IToastContext;
  userValue?: Partial<IUserContext>;
  headerValue?: IHeaderContext;
  spotifyValue?: ISpotifyContext;
  contextMenuValue?: IContextMenuContext;
  modalValue?: IModalContext;
}

export function AppContextProvider({
  children,
  translations,
  toastValue,
  userValue,
  headerValue,
  spotifyValue,
  contextMenuValue,
  modalValue,
}: PropsWithChildren<
  AppContextProviderProps & TranslationsContextProviderProps
>): ReactElement {
  const translationsValue = useMemo(() => ({ translations }), [translations]);

  return (
    <TranslationsContext.Provider value={translationsValue}>
      <ToastContextProvider value={toastValue}>
        <UserContextProvider value={userValue}>
          <HeaderContextProvider value={headerValue}>
            <SpotifyContextProvider value={spotifyValue}>
              <LyricsContextContextProvider>
                <ContextMenuContextProvider value={contextMenuValue}>
                  <ModalContextProvider value={modalValue}>
                    {children}
                  </ModalContextProvider>
                </ContextMenuContextProvider>
              </LyricsContextContextProvider>
            </SpotifyContextProvider>
          </HeaderContextProvider>
        </UserContextProvider>
      </ToastContextProvider>
    </TranslationsContext.Provider>
  );
}
