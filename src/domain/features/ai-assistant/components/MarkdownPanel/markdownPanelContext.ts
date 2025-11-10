import { createContext } from 'react';

interface MarkdownPanelState {
  isOpen: boolean;
  filename: string;
  content: string;
}

export interface MarkdownPanelContextValue {
  panelState: MarkdownPanelState;
  openPanel: (filename: string, content: string) => void;
  closePanel: () => void;
}

export const MarkdownPanelContext = createContext<MarkdownPanelContextValue | undefined>(undefined);
