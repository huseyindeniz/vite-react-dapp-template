import React, { useState } from 'react';

import { ActionIcon, Group, Image, Paper, Stack, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { MdContentCopy, MdDownload } from 'react-icons/md';

interface ImageArtifactProps {
  part: {
    type: 'image';
    image: string; // data URL or URL
  };
}

/**
 * Image artifact component - displays AI-generated images
 * Shows image inline with download and copy capabilities
 */
export const ImageArtifact: React.FC<ImageArtifactProps> = ({ part }) => {
  const { t } = useTranslation('feature-ai-assistant');
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = part.image;
    link.download = `image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    try {
      // Convert data URL to blob
      const response = await fetch(part.image);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback: copy the data URL
      await navigator.clipboard.writeText(part.image);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Paper withBorder p="md" my="sm">
      <Stack gap="sm">
        <Image
          src={part.image}
          alt={t('Generated image')}
          fit="contain"
          radius="sm"
          style={{ maxHeight: '400px' }}
        />

        <Group justify="flex-end" gap="xs">
          <Tooltip label={copied ? 'Copied!' : 'Copy image'}>
            <ActionIcon
              variant="subtle"
              onClick={handleCopy}
              color={copied ? 'green' : 'gray'}
            >
              <MdContentCopy size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label={t('Download image')}>
            <ActionIcon variant="subtle" onClick={handleDownload} color="gray">
              <MdDownload size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Stack>
    </Paper>
  );
};
