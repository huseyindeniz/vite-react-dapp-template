import { MessagePrimitive } from '@assistant-ui/react';
import { Paper } from '@mantine/core';

export const UserMessage = () => (
  <MessagePrimitive.Root
    style={{
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'flex-end',
    }}
  >
    <Paper
      bg="blue.6"
      c="white"
      p="md"
      radius="md"
      style={{ maxWidth: '70%' }}
    >
      <MessagePrimitive.Content />
    </Paper>
  </MessagePrimitive.Root>
);
