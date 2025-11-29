import React, { useState } from 'react';

import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { Group, Paper, Stack, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import {
  AgentType,
  DEFAULT_AGENT_TYPE,
} from '@/config/domain/ai-assistant/config';

import { AgentProvider } from '../contexts/AgentContext';
import { useChatRuntime } from '../hooks/useChatRuntime';
import { useMarkdownPanel } from '../hooks/useMarkdownPanel';

import { AgentSelector } from './AgentSelector/AgentSelector';
import { ChatThread } from './ChatThread/ChatThread';
import { MarkdownPanelProvider } from './MarkdownPanel/MarkdownPanelProvider';
import { MarkdownPreviewPanel } from './MarkdownPanel/MarkdownPreviewPanel';

const ChatInterfaceInner: React.FC = () => {
  const { t } = useTranslation('feature-ai-assistant');
  const [selectedAgent, setSelectedAgent] =
    useState<AgentType>(DEFAULT_AGENT_TYPE);

  return (
    <AgentProvider agentType={selectedAgent}>
      <ChatWithRuntime
        selectedAgent={selectedAgent}
        onAgentChange={setSelectedAgent}
        t={t}
      />
    </AgentProvider>
  );
};

interface ChatWithRuntimeProps {
  selectedAgent: AgentType;
  onAgentChange: (agent: AgentType) => void;
  t: (key: string) => string;
}

const ChatWithRuntime: React.FC<ChatWithRuntimeProps> = ({
  selectedAgent,
  onAgentChange,
  t,
}) => {
  const runtime = useChatRuntime(selectedAgent);
  const { panelState, closePanel } = useMarkdownPanel();

  return (
    <AssistantRuntimeProvider runtime={runtime}>
        <Group
          align="stretch"
          gap={0}
          style={{
            height:
              'calc(100vh - var(--app-shell-footer-height, 0px) - var(--app-shell-header-height, 0px) - var(--mantine-spacing-md))',
            width: '100%',
          }}
          wrap="nowrap"
        >
          {/* Chat area - 50% when panel open, 100% when closed */}
          <Stack
            style={{
              width: panelState.isOpen ? '50%' : '100%',
              maxWidth: panelState.isOpen ? '50%' : '1400px',
              margin: panelState.isOpen ? '0' : '0 auto',
              padding: '0 20px',
              transition: 'width 0.3s ease-in-out',
            }}
            gap={0}
          >
            <Group justify="space-between" align="center" mb="md">
              <Title order={3}>{t('AI Assistant')}</Title>
              <Stack gap={0}>
                {t(
                  'This section demonstrates how you can integrate your AI agents into the dApp template.'
                )}
              </Stack>
              <AgentSelector
                value={selectedAgent}
                onChange={onAgentChange}
              />
            </Group>
            <Paper
              shadow="sm"
              p="md"
              style={{
                flex: 1,
                overflow: 'hidden',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <ChatThread />
            </Paper>
          </Stack>

          {/* Markdown preview panel - 50% when open */}
          {panelState.isOpen && (
            <MarkdownPreviewPanel
              filename={panelState.filename}
              content={panelState.content}
              onClose={closePanel}
            />
          )}
        </Group>
      </AssistantRuntimeProvider>
  );
};

export const ChatInterface: React.FC = () => {
  return (
    <MarkdownPanelProvider>
      <ChatInterfaceInner />
    </MarkdownPanelProvider>
  );
};
