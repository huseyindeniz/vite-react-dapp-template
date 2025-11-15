import React from 'react';

import { useTranslation } from 'react-i18next';

import { ChatInterface } from '@/domain/features/ai-assistant/components/ChatInterface';
import { PageMeta } from '@/domain/layout/components/PageMeta/PageMeta';

export const DemoAIAssistantPage: React.FC = () => {
  const { t } = useTranslation('page-demoaiassistant');
  const title: string = t('AI Assistant Demo');
  const description: string = t(
    'AI-powered chat interface for interactive conversations.'
  );

  return (
    <>
      <PageMeta
        title={title}
        description={description}
        url="/demo-ai-assistant"
      />
      <ChatInterface />
    </>
  );
};
