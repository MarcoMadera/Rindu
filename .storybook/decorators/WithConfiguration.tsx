import React, { ReactElement, useEffect, useState } from "react";

import { StoryContext } from "@storybook/react";

import StorybookConfigurationModal, {
  StorybookConfigurationModalProps,
} from "../../components/StorybookConfigurationModal";
import { AppContextProvider } from "../../context/AppContextProvider";
import { useModal } from "../../hooks";
import { translations as allTranslations } from "../../i18n";
import { getLocale } from "../../utils/locale";
import { IHeaderContext } from "context/HeaderContext";
import { IContextMenuContext } from "types/contextMenu";
import { ISpotifyContext } from "types/spotify";

interface StorybookModal extends StorybookConfigurationModalProps {
  open: boolean;
  handleClose: () => void;
}

function StorybookModal({
  open,
  handleClose,
  setProduct,
  setIsLogin,
  setLanguage,
  product,
  isLogin,
  language,
}: StorybookModal) {
  const { setModalData } = useModal();
  useEffect(() => {
    if (open) {
      setModalData({
        title: "Configuration",
        modalElement: (
          <StorybookConfigurationModal
            setProduct={setProduct}
            setIsLogin={setIsLogin}
            product={product}
            isLogin={isLogin}
            language={language}
            setLanguage={setLanguage}
          />
        ),
        modalRootId: "storyBookModal",
        handleClose,
      });
    }

    return () => {
      setModalData(null);
    };
  }, [
    handleClose,
    isLogin,
    language,
    open,
    product,
    setIsLogin,
    setLanguage,
    setModalData,
    setProduct,
  ]);

  return null;
}

export const WithConfiguration = (
  Story: React.FC,
  context: StoryContext
): ReactElement => {
  const initialLanguage = getLocale(context.globals.language as string | null);
  const [language, setLanguage] = useState(initialLanguage);
  const translations = allTranslations[initialLanguage];
  const [openModal, setOpenModal] = useState(false);
  const [product, setProduct] = useState<string>(
    (context.globals.product as string | null) ?? "premium"
  );
  const [isLogin, setIsLogin] = useState<boolean>(
    (context.globals.isLogin as boolean | null) || true
  );

  useEffect(() => {
    const button = window.top?.document.querySelector<HTMLButtonElement>(
      '[title="The configuration to display the components in"]'
    );
    function handleOpenModal(e: globalThis.MouseEvent): void {
      e.preventDefault();
      e.stopPropagation();
      if (openModal) {
        setOpenModal(false);
      } else {
        setOpenModal(true);
      }
    }
    if (button) {
      button.addEventListener("click", handleOpenModal);
    }

    return () => {
      if (button) {
        button.removeEventListener("click", handleOpenModal);
      }
    };
  }, [openModal]);

  const parameters = context.parameters as {
    spotifyValue?: ISpotifyContext;
    contextMenuValue?: IContextMenuContext;
    headerValue?: IHeaderContext;
  };

  const container = context.parameters.container as {
    backgroundTheme: string | null;
    disablePadding: string | null;
    style: Record<string, string>;
  };

  const backgrounThemeColor =
    container?.backgroundTheme === "dark" ? "#121212" : "#fff";

  const backgroundColor = !container?.backgroundTheme
    ? "transparent"
    : backgrounThemeColor;

  return (
    <div
      style={{
        padding: container?.disablePadding ? "" : "3rem",
        backgroundColor: backgroundColor,
        ...container?.style,
      }}
      id="__next"
    >
      <AppContextProvider
        translations={translations}
        userValue={{
          isLogin: isLogin,
          user: {
            product,
            birthdate: "1990-01-01",
            country: "US",
            display_name: "Marco Madera",
            email: "rindu@marcomadera.com",
            id: "12133024755",
            images: [
              {
                url: "https://i.scdn.co/image/ab6775700000ee85483a9d1a47289376804a5234",
                height: 640,
                width: 640,
              },
            ],
            uri: "spotify:user:12133024755",
            type: "user",
            href: "https://api.spotify.com/v1/users/12133024755",
            followers: {
              href: null,
              total: 0,
            },
            external_urls: {
              spotify: "https://open.spotify.com/user/12133024755",
            },
          } as SpotifyApi.UserObjectPrivate,
        }}
        spotifyValue={parameters.spotifyValue}
        contextMenuValue={parameters.contextMenuValue}
        headerValue={parameters.headerValue}
      >
        <StorybookModal
          open={openModal}
          handleClose={() => {
            if (openModal) {
              setOpenModal(false);
            }
          }}
          setProduct={(product) => {
            setProduct(product);
            context.globals.product = product;
          }}
          setIsLogin={(isLogin) => {
            setIsLogin(isLogin);
            context.globals.isLogin = isLogin;
          }}
          setLanguage={(language) => {
            setLanguage(language);
            context.globals.language = language;
          }}
          language={initialLanguage || language}
          product={product}
          isLogin={isLogin}
        />
        <Story />
      </AppContextProvider>
      <div id="globalModal" />
      <div id="toast" />
      <div id="contextMenu" />
      <div id="storyBookModal" />
    </div>
  );
};
