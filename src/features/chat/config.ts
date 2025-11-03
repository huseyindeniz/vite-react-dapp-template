/**
 * Chat agent configuration
 * Defines supported AI agents and their properties
 */

export const CHAT_AGENTS = {
  langgraph: {
    label: 'LangGraph',
  },
  'google-adk': {
    label: 'Google ADK',
  },
} as const;

export type AgentType = keyof typeof CHAT_AGENTS;

export const DEFAULT_AGENT_TYPE: AgentType = 'langgraph';

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
