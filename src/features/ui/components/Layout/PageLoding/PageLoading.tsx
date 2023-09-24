import { Box, VStack, Progress } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const PageLoading: React.FC = () => {
  const { t } = useTranslation('Layout');
  return (
    <VStack mt="10">
      <Box fontSize={'xs'}>
        {t('Please wait while the requested page is loading...')}
      </Box>
      <Box w="sm">
        <Progress title="Page loading" size="xs" isIndeterminate />
      </Box>
    </VStack>
  );
};
