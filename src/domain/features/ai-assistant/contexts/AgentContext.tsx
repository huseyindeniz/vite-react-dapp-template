import { useMemo, ReactNode } from 'react';

import { useTranslation } from 'react-i18next';

import { AgentType, getChatAgents } from '@/config/domain/ai-assistant/config';

import { AgentContext, AgentContextValue } from './agentContextValue';

interface AgentProviderProps {
  agentType: AgentType;
  children: ReactNode;
}

export const AgentProvider = ({ agentType, children }: AgentProviderProps) => {
  const { t, i18n } = useTranslation('feature-ai-assistant');

  const value = useMemo((): AgentContextValue => {
    const agents = getChatAgents(t);
    const config = agents[agentType];
    const iconPath = `assets/images/agents/${agentType}.webp`;

    // Spread config fields explicitly into context value
    return {
      agentType,
      iconPath,
      label: config.label,
      enabled: config.enabled,
      suggestions: config.suggestions,
      suggestionCategories: config.suggestionCategories,
      messageValidation: config.messageValidation,
      fileAttachment: config.fileAttachment,
    };
  }, [agentType, i18n.resolvedLanguage]);

  return (
    <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
  );
};
