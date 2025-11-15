import { AttachmentPrimitive, MessagePrimitive } from '@assistant-ui/react';
import { Avatar, Group, Paper, Text } from '@mantine/core';
import { MdAttachFile } from 'react-icons/md';

import { useOAuth } from '@/domain/features/oauth/hooks/useOAuth';

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

export const UserMessage = () => {
  const { user } = useOAuth();

  return (
    <MessagePrimitive.Root
      style={{
        marginBottom: '0.5rem',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <Group align="flex-start" gap="xs" wrap="nowrap">
        <Paper
          bg="blue.6"
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
        <Avatar
          src={user?.avatarUrl}
          alt={user?.name}
          size="md"
          radius="xl"
          color="blue"
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
      </Group>
    </MessagePrimitive.Root>
  );
};
