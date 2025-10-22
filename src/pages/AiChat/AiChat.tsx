import React from 'react';

import { useTranslation } from 'react-i18next';

import { ChatInterface } from '@/features/chat/components/ChatInterface';
import { PageMeta } from '@/features/ui/mantine/components/PageMeta/PageMeta';

export const AiChatPage: React.FC = () => {
  const { t } = useTranslation('PageAiChat');
  const title: string = t('AI Chat');
  const description: string = t(
    'AI-powered chat interface for interactive conversations.'
  );

  return (
    <>
      <PageMeta title={title} description={description} url="/ai-chat" />
      <ChatInterface />
    </>
  );
};
