import {
  Attachment,
  CompleteAttachment,
  PendingAttachment,
} from '@assistant-ui/react';
import log from 'loglevel';

/**
 * Simple attachment adapter for demo purposes
 * Converts files to base64 data URLs for inline use
 *
 * Supported image formats: PNG, JPEG, JPG, GIF, WebP, SVG
 * Supported document formats: PDF, TXT, MD, JSON, CSV, Word, Excel
 */
export class SimpleAttachmentAdapter {
  accept =
    'image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml,application/pdf,text/plain,text/markdown,application/json,text/csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  async add({ file }: { file: File }): Promise<PendingAttachment> {
    log.debug('Adding attachment:', file.name, file.type);

    const id = `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Determine attachment type
    let type: 'image' | 'document' | 'file' = 'file';
    if (file.type.startsWith('image/')) {
      type = 'image';
    } else if (
      file.type === 'application/pdf' ||
      file.type.startsWith('text/') ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type.startsWith('application/vnd.openxmlformats-officedocument')
    ) {
      type = 'document';
    }

    return {
      id,
      type,
      name: file.name,
      contentType: file.type,
      file,
      status: {
        type: 'running',
        reason: 'uploading',
        progress: 0,
      },
    };
  }

  async remove(attachment: Attachment): Promise<void> {
    log.debug('Removing attachment:', attachment.id);
    // No cleanup needed for demo - files are just converted to data URLs
  }

  async send(attachment: PendingAttachment): Promise<CompleteAttachment> {
    log.debug('Sending attachment:', attachment.id);

    try {
      // Convert file to data URL
      const dataUrl = await this.fileToDataUrl(attachment.file);

      // Create content based on type
      const content =
        attachment.type === 'image'
          ? [
              {
                type: 'image' as const,
                image: dataUrl,
              },
            ]
          : [
              {
                type: 'file' as const,
                filename: attachment.name,
                data: dataUrl,
                mimeType: attachment.contentType,
              },
            ];

      return {
        id: attachment.id,
        type: attachment.type,
        name: attachment.name,
        contentType: attachment.contentType,
        status: {
          type: 'complete',
        },
        content,
      };
    } catch (error) {
      log.error('Error sending attachment:', error);
      throw error;
    }
  }

  /**
   * Convert File to data URL
   */
  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
