import React from 'react';

import {
  Text,
  Button,
  Menu,
  MenuDivider,
  Group,
  Anchor,
  Center,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import { MdContentCopy, MdDashboard } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';

import { Network } from '../../models/network/types/Network';
import { Web3Wallet } from '../../models/provider/types/Web3Wallet';
import { NetworkLogo } from '../NetworkLogo/NetworkLogo';
import { WalletLogo } from '../WalletLogo/WalletLogo';

import { Identicon } from './Identicon';

export interface DropdownMenuProps {
  address: string;
  currentNetwork: Network | null;
  connectedWallet: Web3Wallet | null;
  addressExplorerUrl: string | undefined;
  userPageLink: string;
  onCopyAddressClicked: () => void;
  onDisconnectClicked: () => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  address,
  currentNetwork,
  connectedWallet,
  addressExplorerUrl,
  userPageLink,
  onCopyAddressClicked,
  onDisconnectClicked,
}) => {
  const { t } = useTranslation('feature-wallet');

  return (
    <Menu position="bottom-end">
      <Menu.Target>
        <Button bg="gray" variant="outline" ml={2}>
          <Group>
            {connectedWallet ? (
              <WalletLogo
                label={connectedWallet.label}
                wallet={connectedWallet.name}
              />
            ) : null}
            {currentNetwork ? (
              <NetworkLogo
                networkId={currentNetwork?.chainId}
                networkName={currentNetwork?.chainName}
              />
            ) : null}
            <Text fz="md" fw="medium" mr="2">
              {address}
            </Text>
            <Identicon size={24} account={address} />
          </Group>
        </Button>
      </Menu.Target>
      <Menu.Dropdown m={0}>
        <Menu.Item disabled>
          <Center>
            <Identicon size={64} account={address} />
          </Center>
        </Menu.Item>
        <Menu.Item disabled ta="center">
          <Text>{address}</Text>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          leftSection={<MdDashboard />}
          component={RouterLink}
          to={userPageLink}
        >
          {t('Dashboard')}
        </Menu.Item>
        <Menu.Item
          leftSection={<MdContentCopy />}
          onClick={() => onCopyAddressClicked()}
        >
          {t('Copy Address')}
        </Menu.Item>
        <Menu.Item
          component={Anchor}
          ref={`${addressExplorerUrl}/${address}`}
          leftSection={<FaExternalLinkAlt />}
        >
          {t('View on Explorer')}
        </Menu.Item>
        <MenuDivider />
        <Menu.Item
          leftSection={<IoIosLogOut />}
          onClick={() => onDisconnectClicked()}
        >
          {t('Disconnect')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
