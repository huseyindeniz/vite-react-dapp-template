import { useTranslation } from 'react-i18next';

import { i18nConfig } from '../features/i18n/config';

export const usePageLink = () => {
  const { i18n } = useTranslation();
  const pageLink = (path: string) => {
    const translatedPath =
      i18n.resolvedLanguage === i18nConfig.fallbackLang.code
        ? path
        : `/${i18n.resolvedLanguage}${path}`;

    return translatedPath;
  };

  return { pageLink };
};
