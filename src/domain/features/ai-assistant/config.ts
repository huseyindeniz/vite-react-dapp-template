/**
 * Chat agent configuration
 * Defines supported AI agents and their properties
 */

import { CHAT_AGENTS } from '@/config/domain/ai-assistant/config';

import { AgentType } from './types/AgentType';

/**
 * Get chat agent configuration by type
 */
export const getChatAgentByType = (type: AgentType) => {
  return CHAT_AGENTS[type];
};

/**
 * Get all available agent types
 */
export const getAvailableAgentTypes = (): AgentType[] => {
  return Object.keys(CHAT_AGENTS) as AgentType[];
};
