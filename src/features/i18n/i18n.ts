import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { i18nConfig } from '@/config/i18n/config';

import { resources } from './i18nResources';

const detectionOptions = {
  lookupFromPathIndex: 0,
  order: ['path', 'navigator'],
  lookupQuerystring: i18nConfig.urlParam,
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  convertDetectedLanguage: (lng: string) => {
    const fullLang = i18nConfig.supportedLanguages.find(l =>
      l.code.startsWith(lng)
    );
    if (fullLang === undefined) {
      return lng;
    }
    return fullLang.code;
  },
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  //debug: process.env.NODE_ENV === "development",
  debug: i18nConfig.debug,
  resources,
  fallbackLng: i18nConfig.fallbackLang.code,
  detection: detectionOptions,
  keySeparator: false,
  //supportedLngs: i18nConfig.supportedLanguages.map((l) => l.code),
  //nonExplicitSupportedLngs: true,
  returnEmptyString: false,
});

export { i18n };
