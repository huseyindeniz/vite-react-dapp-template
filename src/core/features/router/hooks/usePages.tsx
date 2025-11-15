import React from 'react';

import { useTranslation } from 'react-i18next';

import { i18nConfig } from '@/config/core/i18n/config';

import { MenuType } from '../types/MenuType';

import { useRoutes } from './useRoutes';

export const usePages = () => {
  const { i18n } = useTranslation('menu');

  const { homeRoute, pageRoutes } = useRoutes();

  const homeMenuItem: MenuType = {
    ...homeRoute,
    path:
      i18n.resolvedLanguage === i18nConfig.fallbackLang.code
        ? ''
        : `/${i18n.resolvedLanguage}/`,
  };

  const mainMenuItems: MenuType[] = [
    homeMenuItem,
    ...pageRoutes
      .filter((m): m is MenuType => m.isShownInMainMenu === true)
      .map((m: MenuType) => {
        return {
          ...m,
          path:
            i18n.resolvedLanguage === i18nConfig.fallbackLang.code
              ? m.path
              : `/${i18n.resolvedLanguage}/${m.path}`,
        };
      }),
  ];

  const secondaryMenuItems: MenuType[] = [
    homeMenuItem,
    ...pageRoutes
      .filter((m): m is MenuType => m.isShownInSecondaryMenu === true)
      .map((m: MenuType) => {
        return {
          ...m,
          path:
            i18n.resolvedLanguage === i18nConfig.fallbackLang.code
              ? m.path
              : `/${i18n.resolvedLanguage}/${m.path}`,
        };
      }),
  ];

  return React.useMemo(() => {
    return {
      homeRoute,
      pageRoutes,
      mainMenuItems,
      secondaryMenuItems,
    };
  }, [
    i18n.resolvedLanguage,
    homeRoute,
    pageRoutes,
    mainMenuItems,
    secondaryMenuItems,
  ]);
};
