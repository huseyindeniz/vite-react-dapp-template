import { Box, Button, Title, Modal, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { FiExternalLink } from 'react-icons/fi';

export const WhySignNeeded: React.FC = () => {
  const { t } = useTranslation('FeatureWallet');
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <Button size="xs" color="yellow" autoContrast onClick={open}>
        {t("Why On Earth I'd Sign With My Wallet? Is it safe?")}
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title={t('Why Sign Needed? Is it Safe?')}
      >
        <Stack>
          <Title order={5} c="yellow">
            {t('Why Personal Sign? Ensuring Your Security')}
          </Title>
          <Text size="sm">
            {t(
              "Connecting your Web3 wallet? You'll encounter a request for personal sign-in. It's different from eth sign and designed for your safety."
            )}
          </Text>
          <Title order={5} c="green">
            {t('Personal Sign: Safe and Secure')}
          </Title>
          <Text size="sm">
            {t(
              'Personal sign verifies your wallet without enabling transactions—entirely secure, no risk to your funds. We use it solely to confirm wallet authenticity.'
            )}
          </Text>
          <Title order={5} c="red">
            {t('Eth Sign: Beware of Risks')}
          </Title>
          <Text size="sm">
            {t(
              "Eth sign is risky, allowing external access to drain your wallet. We don't request it—avoid signing eth requests on unfamiliar sites to protect your assets."
            )}
          </Text>
          <Box ta="right">
            <Button
              component="a"
              href="https://docs.metamask.io/wallet/how-to/sign-data/#use-personal_sign"
              variant="default"
              size="xs"
              rightSection={<FiExternalLink />}
              fw="normal"
              target="_blank"
            >
              {t('More Info')}
            </Button>
          </Box>
        </Stack>
      </Modal>
    </>
  );
};
