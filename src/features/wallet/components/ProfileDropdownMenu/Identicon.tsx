import styled from "@emotion/styled";
import Jazzicon from "@metamask/jazzicon";
import React, { useEffect, useRef } from "react";

const StyledIdenticon = styled.div`
  border-radius: 1.125rem;
`;

export interface IdenticonProps {
  size: number;
  account: string;
}

export const Identicon: React.FC<IdenticonProps> = ({ size, account }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(
        Jazzicon(size, parseInt(account.slice(2, 10), 16))
      );
    }
  }, [account, size]);

  return <StyledIdenticon ref={ref} />;
};
