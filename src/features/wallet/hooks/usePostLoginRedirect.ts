import { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import { POST_LOGIN_REDIRECT_PATH } from '../config';

import { useWalletAuthentication } from './useWalletAuthentication';

export const usePostLoginRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useWalletAuthentication();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (
      isAuthenticated && 
      POST_LOGIN_REDIRECT_PATH && 
      !hasRedirected.current
    ) {
      hasRedirected.current = true;
      navigate(POST_LOGIN_REDIRECT_PATH);
    }
    
    if (!isAuthenticated) {
      hasRedirected.current = false;
    }
  }, [isAuthenticated, navigate]);
};