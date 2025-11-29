import { useMemo, useCallback, useEffect } from 'react';

import { useLocalRuntime } from '@assistant-ui/react';

import { AgentType } from '@/config/domain/ai-assistant/config';
import {
  chatService,
  attachmentAdapter,
} from '@/config/domain/ai-assistant/services';
import { useOAuth } from '@/domain/features/oauth/hooks/useOAuth';

import { useAgent } from './useAgent';

/**
 * Hook to create a chat runtime for a specific agent type
 * Uses dependency injection pattern - receives adapter via chatService
 *
 * @param agentType - The type of agent to use (e.g., 'langgraph', 'google-adk')
 * @returns Assistant UI runtime instance
 */
export const useChatRuntime = (agentType: AgentType) => {
  // Get file attachment config from agent context
  const { fileAttachment } = useAgent();

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

  // Update attachment adapter config when agent changes
  useEffect(() => {
    attachmentAdapter.setConfig(fileAttachment);
  }, [fileAttachment]);

  // Get adapter from service (singleton)
  const adapter = useMemo(() => {
    return chatService.getAdapter(agentType);
  }, [agentType]);

  const runtime = useLocalRuntime(adapter, {
    initialMessages: [],
    adapters: {
      attachments: attachmentAdapter,
    },
  });

  return runtime;
};
