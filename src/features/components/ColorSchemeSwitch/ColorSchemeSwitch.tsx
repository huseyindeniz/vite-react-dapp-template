import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';

export const ColorSchemeSwitch: React.FC = () => {
  const { t } = useTranslation('feature-components');
  const { toggleColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });

  return (
    <ActionIcon
      onClick={toggleColorScheme}
      variant="default"
      size="lg"
      aria-label={t('Toggle color scheme')}
    >
      {computedColorScheme === 'light' ? <IoMdMoon /> : <IoMdSunny />}
    </ActionIcon>
  );
};
