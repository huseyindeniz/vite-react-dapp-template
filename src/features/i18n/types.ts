export enum LangCode {
  TR_TR = 'tr-TR',
  EN_US = 'en-US',
}

export type SupportedLang = {
  code: LangCode;
  label: string;
};

export type I18NConfig = {
  supportedLanguages: SupportedLang[];
  fallbackLang: SupportedLang;
  urlParam: string;
  debug: boolean;
};
