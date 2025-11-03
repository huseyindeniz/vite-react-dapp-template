import { Box, Stack, Text, Progress } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export const PageLoading: React.FC = () => {
  const { t } = useTranslation('feature-ui');
  return (
    <Stack mt="xl" align="center">
      <Text size="xs">
        {t('Please wait while the requested page is loading...')}
      </Text>
      <Box w={300}>
        <Progress size="xs" value={100} animated />
      </Box>
    </Stack>
  );
};
