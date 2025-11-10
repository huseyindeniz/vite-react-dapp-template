import { AttachmentPrimitive, MessagePrimitive } from '@assistant-ui/react';
import { Paper, Text } from '@mantine/core';
import { MdAttachFile } from 'react-icons/md';

const UserMessageAttachment = () => (
  <AttachmentPrimitive.Root>
    <Text
      size="xs"
      c="gray.3"
      style={{ display: 'flex', alignItems: 'center', gap: 4 }}
    >
      <MdAttachFile size={14} />
      <AttachmentPrimitive.Name />
    </Text>
  </AttachmentPrimitive.Root>
);

export const UserMessage = () => (
  <MessagePrimitive.Root
    style={{
      marginBottom: '0.5rem',
      display: 'flex',
      justifyContent: 'flex-end',
    }}
  >
    <Paper
      bg="blue.6"
      c="white"
      px={8}
      py={4}
      radius="md"
      style={{
        maxWidth: '70%',
        display: 'inline-block',
        lineHeight: 1.2,
      }}
    >
      <MessagePrimitive.Content />
      <MessagePrimitive.Attachments
        components={{ Attachment: UserMessageAttachment }}
      />
    </Paper>
  </MessagePrimitive.Root>
);
