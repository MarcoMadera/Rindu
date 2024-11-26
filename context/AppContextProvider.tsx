import { PropsWithChildren, ReactElement, useMemo } from "react";

import { LyricsContextContextProvider } from "./LyricsContextProvider";
import { PermissionsContextProvider } from "./PermissionsContextProvider";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import { HeaderContextProvider, IHeaderContext } from "context/HeaderContext";
import { IModalContext, ModalContextProvider } from "context/ModalContext";
import { SpotifyContextProvider } from "context/SpotifyContext";
import { IToastContext, ToastContextProvider } from "context/ToastContext";
import TranslationsContext, {
  TranslationsContextProviderValue,
} from "context/TranslationsContext";
import { IUserContext, UserContextProvider } from "context/UserContext";
import { IContextMenuContext } from "types/contextMenu";
import { UserRole } from "types/permissions";
import { ISpotifyContext } from "types/spotify";
import { getLocale, LOCALE_COOKIE, takeCookie } from "utils";
import { isInEnum } from "utils/isInEnum";

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
  locale,
  toastValue,
  userValue,
  headerValue,
  spotifyValue,
  contextMenuValue,
  modalValue,
}: PropsWithChildren<
  AppContextProviderProps & TranslationsContextProviderValue
>): ReactElement {
  const localefinal = locale ?? getLocale(takeCookie(LOCALE_COOKIE));
  const translationsValue = useMemo(
    () => ({ translations, locale: localefinal }),
    [translations, localefinal]
  );

  return (
    <TranslationsContext.Provider value={translationsValue}>
      <ToastContextProvider value={toastValue}>
        <UserContextProvider value={userValue}>
          <PermissionsContextProvider
            translations={translationsValue.translations}
            role={
              isInEnum(userValue?.user?.product, UserRole)
                ? userValue?.user?.product
                : UserRole.Visitor
            }
          >
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
          </PermissionsContextProvider>
        </UserContextProvider>
      </ToastContextProvider>
    </TranslationsContext.Provider>
  );
}
