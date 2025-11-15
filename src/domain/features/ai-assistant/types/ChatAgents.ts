import { AgentConfig } from './AgentConfig';

export interface ChatAgents {
  langgraph: AgentConfig;
  'google-adk': AgentConfig;
  demo: AgentConfig;
}
