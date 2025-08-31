import React from 'react';

import { useTranslation } from 'react-i18next';

import { i18nConfig } from '@/features/i18n/config';
import { useWalletAuthentication } from '@/features/wallet/hooks/useWalletAuthentication';
import { routes } from '@/pages/routes';

import { MenuType } from '../types/MenuType';

export const usePages = () => {
  const { i18n } = useTranslation('Menu');
  const { isAuthenticated } = useWalletAuthentication();

  const { homeRoute, userRoute, pageRoutes } = routes();

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
      .filter(m => m.isShownInMainMenu)
      .map(m => {
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
      .filter(m => m.isShownInSecondaryMenu)
      .map(m => {
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
      userRoute,
      pageRoutes,
      mainMenuItems,
      secondaryMenuItems,
    };
  }, [i18n.resolvedLanguage, isAuthenticated]);
};
