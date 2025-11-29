import React, { useMemo } from 'react';

import { Group, Image, Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import {
  AgentType,
  getChatAgents,
} from '@/config/domain/ai-assistant/config';

interface AgentSelectorProps {
  value: AgentType;
  onChange: (value: AgentType) => void;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  value,
  onChange,
}) => {
  const { t, i18n } = useTranslation('feature-ai-assistant');

  const options = useMemo(() => {
    const agents = getChatAgents(t);
    return Object.entries(agents).map(([key, config]) => ({
      value: key,
      label: config.label,
      disabled: !config.enabled,
    }));
  }, [i18n.resolvedLanguage]);

  return (
    <Select
      label={t('Select AI Agent')}
      placeholder={t('Choose an agent')}
      value={value}
      onChange={val => onChange(val as AgentType)}
      data={options}
      allowDeselect={false}
      comboboxProps={{ withinPortal: false }}
      leftSection={
        <Image
          w={20}
          h={20}
          src={`assets/images/agents/${value}.webp`}
          alt={value}
        />
      }
      renderOption={({ option }) => (
        <Group gap="sm">
          <Image
            w={20}
            h={20}
            src={`assets/images/agents/${option.value}.webp`}
            alt={option.label}
          />
          {option.label}
        </Group>
      )}
      styles={{
        root: {
          minWidth: '200px',
        },
      }}
    />
  );
};
