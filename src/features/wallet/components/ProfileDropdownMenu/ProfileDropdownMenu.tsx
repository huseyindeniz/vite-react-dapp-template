import React, { useEffect, useState } from 'react';

import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import useTypedSelector from '@/hooks/useTypedSelector';
import { usePageLink } from '@/pages/usePageLink';

import { useActions } from '../../hooks/useActions';

import { DropdownMenu } from './DropdownMenu';

export const ProfileDropdownMenu: React.FC = () => {
  const { t } = useTranslation('FeatureWallet');
  const navigate = useNavigate();
  const { pageLink } = usePageLink();
  const toast = useToast();
  const actions = useActions();
  const account = useTypedSelector(state => state.wallet.account.account);
  const currentNetwork = useTypedSelector(
    state => state.wallet.network.network
  );
  const connectedWallet = useTypedSelector(
    state => state.wallet.provider.connectedWallet
  );

  const [addressExplorerUrl, setAddressExplorerUrl] = useState<string>('');
  const [domainOrAddressTruncated, setDomainOrAddressTruncated] =
    useState<string>('');
  const [avatarURL, setAvatarURL] = useState<string>('');

  useEffect(() => {
    if (currentNetwork) {
      setAddressExplorerUrl(
        `${currentNetwork.blockExplorerUrls[0]}/${currentNetwork.addressExplorerUrl}`
      );
    }
  }, [currentNetwork]);

  useEffect(() => {
    if (account) {
      const domainNameOrAddress: string =
        account.domainName && account.domainName !== ''
          ? account.domainName
          : account.shortAddress;
      setDomainOrAddressTruncated(
        domainNameOrAddress && domainNameOrAddress.length > 20
          ? domainNameOrAddress?.slice(0, 4) +
              '...' +
              domainNameOrAddress?.slice(-6)
          : domainNameOrAddress
      );
      setAvatarURL(account.avatarURL ?? '');
    }
  }, [account]);

  const onCopyClicked = () => {
    navigator.clipboard.writeText(account?.address ?? '');
    toast({
      title: t('Address copied.'),
      description: t(
        'The address of your account has been copied to the clipboard.'
      ),
      status: 'info',
      isClosable: true,
    });
  };

  const onDisconnectClick = () => {
    actions.disconnectWallet();
    navigate('/');
  };

  return account && account.address && account.address !== '' ? (
    <DropdownMenu
      address={account.address}
      domainOrAddressTruncated={domainOrAddressTruncated ?? ''}
      avatarURL={avatarURL}
      currentNetwork={currentNetwork}
      connectedWallet={connectedWallet}
      addressExplorerUrl={addressExplorerUrl}
      userPageLink={pageLink('/user')}
      onCopyAddressClicked={onCopyClicked}
      onDisconnectClicked={onDisconnectClick}
    />
  ) : null;
};
