import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { i18nConfig } from "./config";
import { resources } from "./i18nResources";

const detectionOptions = {
  lookupFromPathIndex: 0,
  order: ["path", "navigator"],
  lookupQuerystring: i18nConfig.urlParam,
  lookupCookie: "i18next",
  lookupLocalStorage: "i18nextLng",
  whitelist: i18nConfig.supportedLanguages.map((l) => l.code),
  checkWhitelist: true,
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  //debug: process.env.NODE_ENV === "development",
  debug: i18nConfig.debug,
  resources: resources,
  fallbackLng: i18nConfig.fallbackLang.code,
  detection: detectionOptions,
  keySeparator: false,
  //supportedLngs: i18nConfig.supportedLanguages.map((l) => l.code),
  //nonExplicitSupportedLngs: true,
  returnEmptyString: false,
});

export default i18n;
