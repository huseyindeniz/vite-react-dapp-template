import React from 'react';

import { AttachmentPrimitive } from '@assistant-ui/react';
import { ActionIcon, Paper, Stack, Text } from '@mantine/core';
import { MdClose, MdInsertDriveFile } from 'react-icons/md';

/**
 * Generic file attachment component for composer
 * Displays file icon with name and remove button
 */
export const FileAttachment: React.FC = () => {
  return (
    <AttachmentPrimitive.Root>
      <Paper withBorder p={4} radius="md" style={{ position: 'relative', width: 100 }}>
        <Stack gap={4} align="center">
          <MdInsertDriveFile size={48} color="var(--mantine-color-gray-6)" />

          <Text size="xs" truncate w="100%">
            <AttachmentPrimitive.Name />
          </Text>
        </Stack>

        <AttachmentPrimitive.Remove asChild>
          <ActionIcon
            variant="filled"
            size="xs"
            color="gray"
            aria-label="Remove"
            style={{ position: 'absolute', top: 2, right: 2 }}
          >
            <MdClose size={12} />
          </ActionIcon>
        </AttachmentPrimitive.Remove>
      </Paper>
    </AttachmentPrimitive.Root>
  );
};
