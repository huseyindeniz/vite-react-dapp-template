import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { resources } from '../src/features/i18n/i18nResources';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    //debug: true,
    lng: 'en-US',
    fallbackLng: 'en-US',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    resources: resources,
  });

export default i18n;
