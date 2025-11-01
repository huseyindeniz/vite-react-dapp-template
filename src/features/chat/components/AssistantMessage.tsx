import { MessagePrimitive } from '@assistant-ui/react';
import { Paper } from '@mantine/core';

export const AssistantMessage = () => (
  <MessagePrimitive.Root
    style={{
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'flex-start',
    }}
  >
    <Paper p="md" radius="md" withBorder style={{ maxWidth: '70%' }}>
      <MessagePrimitive.Content />
    </Paper>
  </MessagePrimitive.Root>
);
