import React from 'react';

import { Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { CHAT_AGENTS, AgentType } from '@/config/domain/ai-assistant/config';

interface AgentSelectorProps {
  value: AgentType;
  onChange: (value: AgentType) => void;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation('feature-ai-assistant');

  const options = Object.entries(CHAT_AGENTS).map(([key, config]) => ({
    value: key,
    label: config.label,
    disabled: !config.enabled,
  }));

  return (
    <Select
      label={t('Select AI Agent')}
      placeholder={t('Choose an agent')}
      value={value}
      onChange={val => onChange(val as AgentType)}
      data={options}
      allowDeselect={false}
      comboboxProps={{ withinPortal: false }}
      styles={{
        root: {
          minWidth: '200px',
        },
      }}
    />
  );
};
