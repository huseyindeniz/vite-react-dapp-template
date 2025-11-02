import { SupportedLang } from './SupportedLang';

export type I18NConfig = {
  supportedLanguages: SupportedLang[];
  fallbackLang: SupportedLang;
  urlParam: string;
  debug: boolean;
};
