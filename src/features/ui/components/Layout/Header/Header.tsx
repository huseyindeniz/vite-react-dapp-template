import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  Divider,
} from '@chakra-ui/react';
import { IoClose } from '@react-icons/all-files/io5/IoClose';
import { IoEllipsisVertical } from '@react-icons/all-files/io5/IoEllipsisVertical';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { MenuType } from '../../../../../pages/types';
import { LangMenu } from '../../../../i18n/components/LangMenu/LangMenu';
import { MainMenu } from '../MainMenu/MainMenu';
import { ProfileMenu } from '../ProfileMenu/ProfileMenu';
import { SiteLogo } from '../SiteLogo/SiteLogo';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';

export interface HeaderProps {
  siteName: string;
  baseUrl: string;
  mainMenuItems: MenuType[];
}

export const Header: React.FC<HeaderProps> = React.memo(
  ({ siteName, baseUrl, mainMenuItems }) => {
    const { t } = useTranslation('Layout');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const mainMenu = (
      <MainMenu onClick={onClose} mainMenuItems={mainMenuItems} />
    );
    const toolsMenu = (
      <>
        <LangMenu />
        <ThemeSwitcher />
      </>
    );
    return (
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            variant="outline"
            icon={isOpen ? <IoClose /> : <IoEllipsisVertical />}
            aria-label={t('Open Menu')}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems="center">
            <SiteLogo siteName={siteName} baseUrl={baseUrl} />
            <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
              {mainMenu}
            </HStack>
          </HStack>
          <Flex alignItems="center">
            <HStack as="nav" m={0} display={{ base: 'none', md: 'flex' }}>
              {toolsMenu}
            </HStack>
            <ProfileMenu />
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as="nav" spacing={2}>
              {mainMenu}
              <Divider />
              {toolsMenu}
            </Stack>
          </Box>
        ) : null}
      </Box>
    );
  }
);
