import { IconButton, useColorMode } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';

export const ThemeSwitcher: React.FC = () => {
  const { t } = useTranslation('Layout');
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      onClick={toggleColorMode}
      role="button"
      variant="outline"
      icon={colorMode === 'light' ? <IoMdMoon /> : <IoMdSunny />}
      aria-label={t('Toggle Color Mode')}
    />
  );
};
