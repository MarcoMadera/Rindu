import { ReactElement } from "react";

import ErrorLayout, { ErrorTranslations } from "layouts/ErrorLayout";

export default function Custom500(): ReactElement | null {
  const translations: ErrorTranslations = {
    es: {
      title: "😱 500 - Error del servidor",
      description: "¡Ay no! Parece que algo salió mal en nuestro servidor.",
      description2: "Por favor, intenta nuevamente más tarde.",
      button: "Volver al inicio",
    },
    en: {
      title: "😱 500 - Server Error",
      description: "Oh no! It seems something went wrong on our server.",
      description2: "Please try again later.",
      button: "Back to home",
    },
  };

  return (
    <ErrorLayout
      errorTranslations={translations}
      playlistId="6IKQrtMc4c00YzONcUt7QH"
      exDescription="500 internal server error"
      clearCookies
    />
  );
}
