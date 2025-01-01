import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

import { isHashRouter } from '../router/config';

import { i18nConfig } from './config';

export const useI18nWatcher = () => {
  const { i18n } = useTranslation();
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // hashrouter: redirect home url to dashed home url
  useEffect(() => {
    if (
      isHashRouter &&
      location.key === 'default' &&
      location.pathname === '/'
    ) {
      navigate('/');
    }
  }, [location.key, isHashRouter]);

  // since i18next can not detect lang from url when hashrouter is used
  // set lang from url manually in case of direct visit
  useEffect(() => {
    if (
      isHashRouter &&
      i18n.resolvedLanguage !== lang &&
      i18nConfig.supportedLanguages.find(l => l.code === lang) !== undefined
    ) {
      i18n.changeLanguage(lang);
    }
  }, [lang, isHashRouter]);

  useEffect(() => {
    if (
      lang !== undefined &&
      lang !== '' &&
      i18nConfig.supportedLanguages.find(l => l.code === lang) === undefined
    ) {
      navigate(`${i18nConfig.fallbackLang.code}/not-found`);
    }
  }, [lang]);
};
