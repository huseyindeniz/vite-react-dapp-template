import React from 'react';

import { Button, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { i18nConfig } from '../../config';
import { useChangeLanguage } from '../../useChangeLanguage';

const LangModal = React.lazy(() =>
  import(/* webpackChunkName: "LangModal" */ './LangModal').then(module => ({
    default: module.LangModal,
  }))
);

export const LangMenu: React.FC = () => {
  const location = useLocation();
  const { i18n } = useTranslation('feature-i18n');
  const { changeLanguage } = useChangeLanguage(
    location.pathname,
    i18n.resolvedLanguage ?? i18nConfig.fallbackLang.code
  );
  const [opened, { open, close }] = useDisclosure();

  return i18nConfig.supportedLanguages.length > 1 ? (
    <React.Suspense fallback={<Loader size="xs" />}>
      <Button onClick={open} variant="outline">
        {i18n.resolvedLanguage}
      </Button>
      <LangModal
        isOpen={opened}
        onClose={close}
        onChange={changeLanguage}
        defaultValue={i18n.resolvedLanguage ?? i18nConfig.fallbackLang.code}
        supportedLanguages={i18nConfig.supportedLanguages}
      />
    </React.Suspense>
  ) : null;
};
