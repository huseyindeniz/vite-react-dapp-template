import React from 'react';

import { MenuType } from '@/pages/types';

import { Copyright } from '../Copyright/Copyright';
import { SecondaryMenu } from '../SecondaryMenu/SecondaryMenu';
import { SiteLogo } from '../SiteLogo/SiteLogo';
import { SocialMenu } from '../SocialMenu/SocialMenu';

import { FooterView } from './FooterView/FooterView';

export interface FooterProps {
  siteName: string;
  baseUrl: string;
  secondaryMenuItems: MenuType[];
}

export const Footer: React.FC<FooterProps> = ({
  siteName,
  baseUrl,
  secondaryMenuItems,
}) => {
  return (
    <FooterView
      firstRowContent={
        <>
          <SiteLogo siteName={siteName} baseUrl={baseUrl} />
          <SecondaryMenu secondaryMenuItems={secondaryMenuItems} />
        </>
      }
      secondRowContent={
        <>
          <Copyright />
          <SocialMenu />
        </>
      }
    />
  );
};
