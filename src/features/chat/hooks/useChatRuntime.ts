import { useMemo, useCallback, useEffect } from 'react';

import { useLocalRuntime } from '@assistant-ui/react';

import { chatService } from '@/features/app/config/services';
import { useOAuth } from '@/features/oauth/hooks/useOAuth';

import type { AgentType } from '../config';

/**
 * Hook to create a chat runtime for a specific agent type
 * Uses dependency injection pattern - receives adapter via chatService
 *
 * @param agentType - The type of agent to use (e.g., 'langgraph', 'google-adk')
 * @returns Assistant UI runtime instance
 */
export const useChatRuntime = (agentType: AgentType) => {
  // Get user ID from auth for session tracking
  const { user } = useOAuth();

  // Create getToken function that returns current user ID
  const getToken = useCallback(() => {
    return user?.id || 'anonymous';
  }, [user?.id]);

  // Update token provider in ChatService
  useEffect(() => {
    chatService.setTokenProvider(getToken);
  }, [getToken]);

  // Get adapter from service (singleton)
  const adapter = useMemo(() => {
    return chatService.getAdapter(agentType);
  }, [agentType]);

  const runtime = useLocalRuntime(adapter, {
    initialMessages: [],
  });

  return runtime;
};
