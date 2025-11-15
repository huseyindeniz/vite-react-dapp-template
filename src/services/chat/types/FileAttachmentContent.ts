export interface FileAttachmentContent {
  type: 'file';
  filename: string;
  data: string;
  mimeType: string;
}
