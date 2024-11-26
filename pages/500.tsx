import { ReactElement } from "react";

import { GetStaticProps } from "next";

import translations from "i18n";
import ErrorLayout, { ErrorTranslations } from "layouts/ErrorLayout";
import { ITranslations } from "types/translations";
import { DEFAULT_LOCALE, extractNestedObject } from "utils";

interface PageProps {
  translations: ITranslations;
  errorTranslations: ErrorTranslations;
}

export default function Custom500({
  errorTranslations,
}: PageProps): ReactElement | null {
  return (
    <ErrorLayout
      errorTranslations={errorTranslations}
      playlistId="6IKQrtMc4c00YzONcUt7QH"
      exDescription="500 internal server error"
      clearCookies
    />
  );
}

export const getStaticProps = (() => {
  const defaultTranslations = translations[DEFAULT_LOCALE];
  const errorTranslations = extractNestedObject(translations, "500");

  return {
    props: {
      translations: defaultTranslations,
      errorTranslations: errorTranslations,
    },
  };
}) satisfies GetStaticProps<PageProps>;
