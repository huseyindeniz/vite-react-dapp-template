import { MessagePrimitive } from '@assistant-ui/react';
import { Paper } from '@mantine/core';

import { useMarkdownPanel } from '../../hooks/useMarkdownPanel';
import { FileArtifact } from '../Artifacts/FileArtifact';
import { ImageArtifact } from '../Artifacts/ImageArtifact';
import { MarkdownText } from '../Artifacts/MarkdownText';

export const AssistantMessage = () => {
  const { openPanel } = useMarkdownPanel();

  return (
    <MessagePrimitive.Root
      style={{
        marginBottom: '0.5rem',
        display: 'flex',
        justifyContent: 'flex-start',
      }}
    >
      <Paper
        px="xs"
        py={2}
        radius="md"
        withBorder
        style={{ maxWidth: '70%' }}
      >
        <MessagePrimitive.Parts
          components={{
            Text: MarkdownText,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Image: (props: any) => <ImageArtifact part={props} />,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            File: (props: any) => (
              <FileArtifact part={props} onMarkdownClick={openPanel} />
            ),
          }}
        />
      </Paper>
    </MessagePrimitive.Root>
  );
};
