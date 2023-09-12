import {
  Box,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  HStack,
  VStack,
  Link,
} from '@chakra-ui/react';
import { FaExternalLinkAlt } from '@react-icons/all-files/fa/FaExternalLinkAlt';
import { IoIosLogOut } from '@react-icons/all-files/io/IoIosLogOut';
import { MdContentCopy } from '@react-icons/all-files/md/MdContentCopy';
import { MdDashboard } from '@react-icons/all-files/md/MdDashboard';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { Network } from '../../models/network/types/Network';
import { NetworkLogo } from '../NetworkLogo/NetworkLogo';

import { Identicon } from './Identicon';

export interface DropdownMenuProps {
  address: string;
  ensOrAddressTruncated: string;
  currentNetwork: Network | null;
  addressExplorerUrl: string | undefined;
  userPageLink: string;
  onCopyAddressClicked: () => void;
  onDisconnectClicked: () => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  address,
  ensOrAddressTruncated,
  currentNetwork,
  addressExplorerUrl,
  userPageLink,
  onCopyAddressClicked,
  onDisconnectClicked,
}) => {
  const { t } = useTranslation('FeatureWallet');

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        cursor="pointer"
        bg="gray.800"
        _hover={{
          backgroundColor: 'gray.700',
        }}
        variant="outline"
        ml={2}
      >
        <HStack>
          {currentNetwork ? (
            <NetworkLogo
              networkId={currentNetwork?.chainId}
              networkName={currentNetwork?.chainName}
            />
          ) : null}
          <Text color="white" fontSize="md" fontWeight="medium" mr="2">
            {ensOrAddressTruncated}
          </Text>
          <Identicon size={24} account={address} />
        </HStack>
      </MenuButton>
      <MenuList alignItems="center" m={0}>
        <VStack align="center">
          <Box>
            <Identicon size={64} account={address} />
          </Box>
          <Box>
            <Text>{ensOrAddressTruncated}</Text>
          </Box>
        </VStack>
        <MenuDivider />
        <MenuItem icon={<MdDashboard />} as={RouterLink} to={userPageLink}>
          {t('Dashboard')}
        </MenuItem>
        <MenuItem
          icon={<MdContentCopy />}
          onClick={() => onCopyAddressClicked()}
        >
          {t('Copy Address')}
        </MenuItem>
        <MenuItem
          as={Link}
          href={`${addressExplorerUrl}/${address}`}
          isExternal
          _hover={{
            textDecoration: 'none',
            border: 'none',
          }}
          icon={<FaExternalLinkAlt />}
        >
          {t('View on Explorer')}
        </MenuItem>
        <MenuDivider />
        <MenuItem icon={<IoIosLogOut />} onClick={() => onDisconnectClicked()}>
          {t('Disconnect')}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
