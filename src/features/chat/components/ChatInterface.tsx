import React, { useState } from 'react';

import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { Container, Stack, Paper, Group } from '@mantine/core';

import { useChatRuntime } from '../runtime/useChatRuntime';
import { DEFAULT_AGENT_TYPE, type AgentType } from '../types/agentTypes';

import { AgentSelector } from './AgentSelector';
import { ChatThread } from './ChatThread';

export const ChatInterface: React.FC = () => {
  const [selectedAgent, setSelectedAgent] =
    useState<AgentType>(DEFAULT_AGENT_TYPE);
  const runtime = useChatRuntime(selectedAgent);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Container
        size="lg"
        style={{ height: 'calc(100vh - 300px)', paddingBottom: '40px' }}
      >
        <Stack style={{ height: '100%' }} gap="md">
          <Group justify="flex-end">
            <AgentSelector value={selectedAgent} onChange={setSelectedAgent} />
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
      </Container>
    </AssistantRuntimeProvider>
  );
};
