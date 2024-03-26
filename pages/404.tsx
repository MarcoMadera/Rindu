import { ReactElement } from "react";

import ErrorLayout, { ErrorTranslations } from "layouts/ErrorLayout";

export default function Custom404(): ReactElement | null {
  const translations: ErrorTranslations = {
    es: {
      title: "😫 404 - No encontrado",
      description: "Oops! Parece que no hemos atinado a la nota correcta.",
      description2: "¿Cómo has llegado aquí?",
      button: "Volver al inicio",
    },
    en: {
      title: "😫 404 - Not found",
      description: "Oops! Looks like we've hit a wrong note.",
      description2: "how did you get here?",
      button: "Back to home",
    },
  };

  return (
    <ErrorLayout
      errorTranslations={translations}
      playlistId="37i9dQZF1DXcBWIGoYBM5M"
      exDescription="404 page not found"
    />
  );
}
