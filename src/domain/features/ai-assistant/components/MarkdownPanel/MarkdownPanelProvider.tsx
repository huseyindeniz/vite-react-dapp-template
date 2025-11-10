import React, { useState } from 'react';

import { MarkdownPanelContext } from './markdownPanelContext';

interface MarkdownPanelState {
  isOpen: boolean;
  filename: string;
  content: string;
}

interface MarkdownPanelProviderProps {
  children: React.ReactNode;
}

/**
 * Provider for markdown preview panel state
 * Manages panel visibility and content
 */
export const MarkdownPanelProvider: React.FC<MarkdownPanelProviderProps> = ({
  children,
}) => {
  const [panelState, setPanelState] = useState<MarkdownPanelState>({
    isOpen: false,
    filename: '',
    content: '',
  });

  const openPanel = (filename: string, content: string) => {
    setPanelState({
      isOpen: true,
      filename,
      content,
    });
  };

  const closePanel = () => {
    setPanelState({
      isOpen: false,
      filename: '',
      content: '',
    });
  };

  return (
    <MarkdownPanelContext.Provider
      value={{ panelState, openPanel, closePanel }}
    >
      {children}
    </MarkdownPanelContext.Provider>
  );
};
