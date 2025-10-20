export type AgentType = 'langgraph' | 'google-adk';

export const AGENT_TYPES: Record<AgentType, { label: string; port: number }> = {
  langgraph: {
    label: 'LangGraph',
    port: 8010,
  },
  'google-adk': {
    label: 'Google ADK',
    port: 8011,
  },
};

export const DEFAULT_AGENT_TYPE: AgentType = 'langgraph';
