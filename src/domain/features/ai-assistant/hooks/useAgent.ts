import { useContext } from 'react';

import {
  AgentContext,
  AgentContextValue,
} from '../contexts/agentContextValue';

export const useAgent = (): AgentContextValue => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within AgentProvider');
  }
  return context;
};
