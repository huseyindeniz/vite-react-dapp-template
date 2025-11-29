/**
 * Chat agent configuration
 * Defines supported AI agents and their properties
 */

import { AgentType } from '@/config/domain/ai-assistant/config';

/**
 * Get all available agent types
 */
export const getAvailableAgentTypes = (): AgentType[] => {
  return Object.values(AgentType);
};
