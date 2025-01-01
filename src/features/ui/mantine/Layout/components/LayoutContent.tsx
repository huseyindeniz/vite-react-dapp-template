import React from 'react';

import { AppShell, Transition } from '@mantine/core';
import { useLocation } from 'react-router-dom';

import { PageLoading } from '../../components/PageLoding/PageLoading';

export const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AppShell.Main>
      <React.Suspense fallback={<PageLoading />} key={location.key}>
        <Transition
          key={location.pathname}
          mounted
          transition="scale"
          duration={300}
          timingFunction="ease"
        >
          {styles => <div style={styles}>{children}</div>}
        </Transition>
      </React.Suspense>
    </AppShell.Main>
  );
};
