import { MarkdownPanelState } from './MarkdownPanelState';

export interface MarkdownPanelContextValue {
  panelState: MarkdownPanelState;
  openPanel: (filename: string, content: string) => void;
  closePanel: () => void;
}
