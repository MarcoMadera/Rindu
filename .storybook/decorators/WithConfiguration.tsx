import React, { useEffect, useState } from "react";
import { AppContextProvider } from "../../context/AppContextProvider";
import { translations, Language } from "../../utils/getTranslations";
import StorybookConfigurationModal, {
  StorybookConfigurationModalProps,
} from "../../components/StorybookConfigurationModal";
import { useModal } from "../../hooks";

interface StorybookModal extends StorybookConfigurationModalProps {
  open: boolean;
  handleClose: () => void;
}

function StorybookModal({
  open,
  handleClose,
  setAccessToken,
  setProduct,
  setIsLogin,
  setLanguage,
  accessToken,
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
            setAccessToken={setAccessToken}
            setProduct={setProduct}
            setIsLogin={setIsLogin}
            accessToken={accessToken}
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
  }, [open]);

  return null;
}

export const WithConfiguration = (Story, context) => {
  const defaultLanguage = context.globals.language?.toUpperCase() || "EN";
  const [language, setLanguage] = useState(defaultLanguage);
  const allTranslations: Record<string, string>[] = Object.values(
    translations[defaultLanguage as Language]
  );
  const allTranslationsFlat = allTranslations.reduce(
    (acc, cur) => ({ ...acc, ...cur }),
    {}
  );
  const [openModal, setOpenModal] = useState(false);
  const [accessToken, setAccessToken] = useState(
    context.globals.accessToken || ""
  );
  const [product, setProduct] = useState(context.globals.product || "premium");
  const [isLogin, setIsLogin] = useState(context.globals.isLogin || true);

  useEffect(() => {
    const button = window.top?.document.querySelector(
      '[title="The configuration to display the components in"]'
    );
    function handleOpenModal(e) {
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

  return (
    <div
      style={{
        padding: context.parameters.container?.disablePadding ? "" : "3rem",
        backgroundColor: `${
          !context.parameters.container?.backgroundTheme
            ? "transparent"
            : context.parameters.container?.backgroundTheme === "dark"
            ? "#121212"
            : "#fff"
        }`,
        ...context.parameters.container?.style,
      }}
      id="__next"
    >
      <AppContextProvider
        translations={allTranslationsFlat}
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
          accessToken,
        }}
        spotifyValue={context.parameters.spotifyValue}
        contextMenuValue={context.parameters.contextMenuValue}
        headerValue={context.parameters.headerValue}
      >
        <StorybookModal
          open={openModal}
          handleClose={() => {
            if (openModal) {
              setOpenModal(false);
            }
          }}
          setAccessToken={(accessToken) => {
            setAccessToken(accessToken);
            context.globals.accessToken = accessToken;
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
          language={defaultLanguage || language}
          accessToken={accessToken}
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
