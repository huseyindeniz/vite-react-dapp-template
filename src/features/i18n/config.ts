import { I18NConfig } from './types/I18NConfig';
import { LangCode } from './types/LangCode';
import { SupportedLang } from './types/SupportedLang';

const langENUS: SupportedLang = {
  code: LangCode.EN_US,
  label: 'English (US)',
};

const langTRTR: SupportedLang = {
  code: LangCode.TR_TR,
  label: 'Türkçe',
};

export const i18nConfig: I18NConfig = {
  supportedLanguages: [langENUS, langTRTR],
  fallbackLang: langENUS,
  urlParam: 'lang',
  debug: false,
};
