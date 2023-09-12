import { IconButton, useColorMode } from '@chakra-ui/react';
import { IoMdMoon } from '@react-icons/all-files/io/IoMdMoon';
import { IoMdSunny } from '@react-icons/all-files/io/IoMdSunny';
import { useTranslation } from 'react-i18next';

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
