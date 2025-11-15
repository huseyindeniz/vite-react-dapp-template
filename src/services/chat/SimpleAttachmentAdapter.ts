import {
  AttachmentAdapter,
  Attachment,
  CompleteAttachment,
  PendingAttachment,
} from '@assistant-ui/react';
import log from 'loglevel';

import { FILE_ATTACHMENT_CONFIG } from '@/config/domain/ai-assistant/config';

/**
 * Simple attachment adapter with validation
 * Converts files to base64 data URLs for inline use
 *
 * Validation rules from config:
 * - Max file size limit
 * - Allowed file types
 * - Allowed file extensions
 */
export class SimpleAttachmentAdapter implements AttachmentAdapter {
  accept = FILE_ATTACHMENT_CONFIG.allowedTypes.join(',');

  async add({ file }: { file: File }): Promise<PendingAttachment> {
    log.debug('Adding attachment:', file.name, file.type);

    // Validate file size
    if (file.size > FILE_ATTACHMENT_CONFIG.maxFileSize) {
      const maxSizeMB = FILE_ATTACHMENT_CONFIG.maxFileSize / (1024 * 1024);
      throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
    }

    // Validate file type
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const isTypeAllowed = (
      FILE_ATTACHMENT_CONFIG.allowedTypes as readonly string[]
    ).includes(file.type);
    const isExtAllowed = (
      FILE_ATTACHMENT_CONFIG.allowedExtensions as readonly string[]
    ).includes(fileExtension);

    if (!isTypeAllowed && !isExtAllowed) {
      throw new Error('File type not supported');
    }

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
