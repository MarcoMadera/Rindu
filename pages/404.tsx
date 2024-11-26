import { ReactElement } from "react";

import { GetStaticProps } from "next";

import translations from "i18n";
import ErrorLayout, { ErrorTranslations } from "layouts/ErrorLayout";
import { ITranslations } from "types/translations";
import { DEFAULT_LOCALE, extractNestedObject } from "utils";

interface PageProps {
  translations: ITranslations;
  notFoundTranslations: ErrorTranslations;
}

export default function Custom404({
  notFoundTranslations,
}: PageProps): ReactElement | null {
  return (
    <ErrorLayout
      errorTranslations={notFoundTranslations}
      playlistId="37i9dQZF1DXcBWIGoYBM5M"
      exDescription="404 page not found"
    />
  );
}

export const getStaticProps = (() => {
  const defaultTranslations = translations[DEFAULT_LOCALE];
  const notFoundTranslations = extractNestedObject(translations, "404");

  return {
    props: {
      translations: defaultTranslations,
      notFoundTranslations: notFoundTranslations,
    },
  };
}) satisfies GetStaticProps<PageProps>;
