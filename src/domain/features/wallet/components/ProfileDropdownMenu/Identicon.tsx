import React, { useEffect, useRef } from 'react';

import Jazzicon from '@metamask/jazzicon';

export interface IdenticonProps {
  size: number;
  account: string;
}

export const Identicon: React.FC<IdenticonProps> = ({ size, account }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = '';
      ref.current.appendChild(
        Jazzicon(size, parseInt(account.slice(2, 10), 16))
      );
    }
  }, [account, size]);

  return <div ref={ref} style={{ borderRadius: '1.125rem' }} />;
};
