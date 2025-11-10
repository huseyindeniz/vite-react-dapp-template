import React, { JSX } from 'react';

import { ProviderEntry } from './types/ProviderEntry';

export const composeProviders = (
  providers: ReadonlyArray<ProviderEntry>
): React.ComponentType<React.PropsWithChildren> => {
  const ProviderComponent: React.FunctionComponent<React.PropsWithChildren> = ({
    children,
  }) => {
    const initialJSX = <>{children}</>;

    return providers.reduceRight<JSX.Element>(
      (prevJSX, { Component: CurrentProvider, props = {} }) => {
        return <CurrentProvider {...props}>{prevJSX}</CurrentProvider>;
      },
      initialJSX
    );
  };

  return ProviderComponent;
};
