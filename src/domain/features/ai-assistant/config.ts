/**
 * Chat agent configuration
 * Defines supported AI agents and their properties
 */

export const CHAT_AGENTS = {
  langgraph: {
    label: 'Agent 1 (with Langgraph)',
    enabled: false,
  },
  'google-adk': {
    label: 'Agent 2 (with Google ADK)',
    enabled: false,
  },
  demo: {
    label: 'Agent 3 (demo)',
    enabled: true,
  },
} as const;

export type AgentType = keyof typeof CHAT_AGENTS;

export const DEFAULT_AGENT_TYPE: AgentType = 'demo';

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
