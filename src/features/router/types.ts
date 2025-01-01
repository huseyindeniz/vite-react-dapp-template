import { RouteObject } from 'react-router-dom';

export type MenuType = {
  path?: string;
  menuLabel: string | null;
  isShownInMainMenu?: boolean;
  isShownInSecondaryMenu?: boolean;
  isProtected?: boolean;
};

export type PageType = RouteObject & MenuType;

export type AppRoutes = {
  homeRoute: PageType;
  userRoute: PageType;
  pageRoutes: PageType[];
};
