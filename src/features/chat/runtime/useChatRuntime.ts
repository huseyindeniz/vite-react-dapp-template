import { useMemo, useCallback } from 'react';

import { useLocalRuntime } from '@assistant-ui/react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { GoogleADKChatModelAdapter } from '@/services/chat/GoogleADKChatModelAdapter';
import { LangGraphChatModelAdapter } from '@/services/chat/LangGraphChatModelAdapter';

import type { AgentType } from '../types/agentTypes';

export const useChatRuntime = (agentType: AgentType) => {
  // Get user ID from auth for session tracking
  const { user } = useAuth();

  // Create getToken function that returns current user ID
  const getToken = useCallback(() => {
    return user?.id || 'anonymous';
  }, [user?.id]);

  const adapter = useMemo(() => {
    switch (agentType) {
      case 'langgraph':
        return new LangGraphChatModelAdapter(getToken);
      case 'google-adk':
        return new GoogleADKChatModelAdapter(getToken);
      default:
        return new LangGraphChatModelAdapter(getToken);
    }
  }, [agentType, getToken]);

  const runtime = useLocalRuntime(adapter, {
    initialMessages: [],
  });

  return runtime;
};
