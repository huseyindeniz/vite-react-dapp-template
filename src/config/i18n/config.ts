import { I18NConfig } from '@/features/i18n/types/I18NConfig';
import { SupportedLang } from '@/features/i18n/types/SupportedLang';

export enum LangCode {
  TR_TR = 'tr-TR',
  EN_US = 'en-US',
}

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
