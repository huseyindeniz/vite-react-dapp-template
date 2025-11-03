#!/usr/bin/env node

import { readFile, writeFile } from './fileUtils.mjs';

/**
 * Replace placeholders in template
 * Placeholders format: {{placeholder}}
 */
export function applyTemplate(template, data) {
  let output = template;

  // Replace all {{key}} placeholders with data[key]
  const placeholderRegex = /\{\{([A-Za-z0-9_.]+)\}\}/g;

  output = output.replace(placeholderRegex, (match, key) => {
    // Support nested keys like {{feature.name}}
    const keys = key.split('.');
    let value = data;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return match; // Keep placeholder if key not found
      }
    }

    return value !== undefined && value !== null ? String(value) : match;
  });

  return output;
}

/**
 * Load template from file and apply data
 */
export function loadAndApplyTemplate(templatePath, data) {
  const template = readFile(templatePath);

  if (!template) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  return applyTemplate(template, data);
}

/**
 * Generate markdown heading
 */
export function heading(level, text) {
  return `${'#'.repeat(level)} ${text}\n\n`;
}

/**
 * Generate markdown list
 */
export function list(items, ordered = false) {
  if (!items || items.length === 0) {
    return '';
  }

  return items.map((item, index) => {
    const prefix = ordered ? `${index + 1}.` : '-';
    return `${prefix} ${item}\n`;
  }).join('') + '\n';
}

/**
 * Generate markdown code block
 */
export function codeBlock(code, language = '') {
  return `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
}

/**
 * Generate markdown table
 */
export function table(headers, rows) {
  if (!headers || headers.length === 0) {
    return '';
  }

  let output = '| ' + headers.join(' | ') + ' |\n';
  output += '|' + headers.map(() => '---').join('|') + '|\n';

  for (const row of rows) {
    output += '| ' + row.join(' | ') + ' |\n';
  }

  return output + '\n';
}

/**
 * Generate markdown link
 */
export function link(text, url) {
  return `[${text}](${url})`;
}

/**
 * Generate markdown bold text
 */
export function bold(text) {
  return `**${text}**`;
}

/**
 * Generate markdown italic text
 */
export function italic(text) {
  return `*${text}*`;
}

/**
 * Generate markdown code inline
 */
export function code(text) {
  return `\`${text}\``;
}

/**
 * Generate markdown blockquote
 */
export function blockquote(text) {
  return text.split('\n').map(line => `> ${line}`).join('\n') + '\n\n';
}

/**
 * Generate markdown horizontal rule
 */
export function hr() {
  return '---\n\n';
}

/**
 * Generate collapsible section (details/summary)
 */
export function collapsible(summary, content) {
  return `<details>\n<summary>${summary}</summary>\n\n${content}\n</details>\n\n`;
}

/**
 * Escape markdown special characters
 */
export function escapeMarkdown(text) {
  return text.replace(/([\\`*_{}[\]()#+\-.!])/g, '\\$1');
}

/**
 * Generate table of contents from headings
 */
export function generateTOC(markdown, maxLevel = 3) {
  const lines = markdown.split('\n');
  const toc = [];

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);

    if (match) {
      const level = match[1].length;
      const text = match[2];

      if (level <= maxLevel) {
        const indent = '  '.repeat(level - 1);
        const anchor = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        toc.push(`${indent}- [${text}](#${anchor})`);
      }
    }
  }

  return toc.join('\n') + '\n\n';
}

/**
 * Format date for documentation
 */
export function formatDate(date = new Date()) {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Format timestamp for documentation
 */
export function formatTimestamp(date = new Date()) {
  return date.toISOString();
}

/**
 * Generate directory tree in markdown
 */
export function directoryTree(tree, prefix = '') {
  let output = '';

  if (typeof tree === 'string') {
    // Already formatted tree
    return codeBlock(tree, '');
  }

  // Recursively format tree structure
  const formatNode = (node, depth = 0) => {
    const indent = '  '.repeat(depth);

    if (typeof node === 'string') {
      output += `${indent}${node}\n`;
    } else if (typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) {
        output += `${indent}${key}/\n`;
        formatNode(value, depth + 1);
      }
    }
  };

  formatNode(tree);

  return codeBlock(output.trim(), '');
}

/**
 * Create badge (GitHub-style)
 */
export function badge(label, value, color = 'blue') {
  return `![${label}](https://img.shields.io/badge/${label}-${value}-${color})`;
}

/**
 * Create status badge
 */
export function statusBadge(status) {
  const colors = {
    stable: 'green',
    experimental: 'yellow',
    deprecated: 'red',
    beta: 'orange'
  };

  const color = colors[status.toLowerCase()] || 'gray';
  return badge('status', status, color);
}

/**
 * Pluralize word based on count
 */
export function pluralize(word, count) {
  if (count === 1) {
    return word;
  }

  // Simple pluralization rules
  if (word.endsWith('y')) {
    return word.slice(0, -1) + 'ies';
  } else if (word.endsWith('s') || word.endsWith('sh') || word.endsWith('ch')) {
    return word + 'es';
  } else {
    return word + 's';
  }
}

/**
 * Generate summary statistics
 */
export function generateSummary(data) {
  const { total, passed, failed } = data;

  return table(
    ['Metric', 'Value'],
    [
      ['Total', total],
      ['Passed', `✅ ${passed}`],
      ['Failed', `❌ ${failed}`],
      ['Success Rate', `${Math.round((passed / total) * 100)}%`]
    ]
  );
}

/**
 * Generate feature summary table
 */
export function generateFeatureTable(features) {
  const headers = ['Feature', 'Type', 'Models', 'Status'];
  const rows = features.map(f => [
    code(f.name),
    f.type,
    f.models ? f.models.length : 'N/A',
    f.status || '✅'
  ]);

  return table(headers, rows);
}

/**
 * Clean up whitespace in generated markdown
 */
export function cleanMarkdown(markdown) {
  // Remove excessive blank lines (more than 2 consecutive)
  let cleaned = markdown.replace(/\n{3,}/g, '\n\n');

  // Ensure single blank line before headings
  cleaned = cleaned.replace(/\n(#+\s)/g, '\n\n$1');

  // Ensure file ends with single newline
  cleaned = cleaned.trim() + '\n';

  return cleaned;
}

/**
 * Save generated documentation
 */
export function saveDocumentation(filePath, content) {
  const cleaned = cleanMarkdown(content);
  writeFile(filePath, cleaned);
  return filePath;
}

/**
 * Generate frontmatter for markdown files
 */
export function frontmatter(data) {
  let output = '---\n';

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      output += `${key}:\n`;
      for (const item of value) {
        output += `  - ${item}\n`;
      }
    } else {
      output += `${key}: ${value}\n`;
    }
  }

  output += '---\n\n';

  return output;
}
