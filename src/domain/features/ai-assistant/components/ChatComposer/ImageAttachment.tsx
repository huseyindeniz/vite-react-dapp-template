import React from 'react';

import { AttachmentPrimitive, useAssistantState } from '@assistant-ui/react';
import { ActionIcon, Image, Paper, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';

/**
 * Image attachment component for composer
 * Displays image thumbnail with remove button
 */
export const ImageAttachment: React.FC = () => {
  const { t } = useTranslation('feature-ai-assistant');
  const attachment = useAssistantState(({ attachment }) => attachment);
  const src =
    attachment.type === 'image' && attachment.file
      ? URL.createObjectURL(attachment.file)
      : undefined;

  return (
    <AttachmentPrimitive.Root>
      <Paper
        withBorder
        p={4}
        radius="md"
        style={{ position: 'relative', width: 100 }}
      >
        <Stack gap={4}>
          {src && (
            <Image
              src={src}
              w={92}
              h={92}
              radius="sm"
              fit="cover"
              alt={t('Attachment preview')}
            />
          )}

          <Text size="xs" truncate>
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
