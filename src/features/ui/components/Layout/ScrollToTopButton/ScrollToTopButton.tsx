import { Box, IconButton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronUp } from 'react-icons/io5';

export const ScrollToTopButton: React.FC = () => {
  const { t } = useTranslation('Layout');
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (scrollPosition > 300) {
    return (
      <>
        <style>
          {`
            html {
              scroll-behavior: smooth;
            }
          `}
        </style>
        <Box position="fixed" bottom="50px" right={['16px', '16px']} zIndex={1}>
          <IconButton
            variant="outline"
            role="button"
            icon={<IoChevronUp />}
            aria-label={t('Go To Top')}
            size="lg"
            onClick={scrollToTop}
          />
        </Box>
      </>
    );
  } else {
    return null;
  }
};
