import { readFileSync } from 'fs';

/**
 * Simple Mustache-like template renderer
 * Supports:
 * - {{variable}} - Simple variable substitution
 * - {{#section}}...{{/section}} - Section rendering (if truthy/array)
 * - {{^section}}...{{/section}} - Inverted section (if falsy/empty)
 */
export function renderTemplate(templatePath, data) {
  const template = readFileSync(templatePath, 'utf-8');
  return render(template, data);
}

function render(template, data) {
  let result = template;

  // Process sections first ({{#...}}...{{/...}})
  result = processSections(result, data);

  // Process inverted sections ({{^...}}...{{/...}})
  result = processInvertedSections(result, data);

  // Process variables ({{...}})
  result = processVariables(result, data);

  return result;
}

/**
 * Process {{#section}}...{{/section}}
 */
function processSections(template, data) {
  const sectionRegex = /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;

  return template.replace(sectionRegex, (match, key, content) => {
    const value = data[key];

    // If falsy, remove section
    if (!value) {
      return '';
    }

    // If array, repeat for each item
    if (Array.isArray(value)) {
      return value.map((item, index) => {
        const itemData = { ...item, index: index + 1 };
        return render(content, itemData);
      }).join('');
    }

    // If truthy, render once
    return render(content, { ...data, ...value });
  });
}

/**
 * Process {{^section}}...{{/section}} (inverted)
 */
function processInvertedSections(template, data) {
  const invertedRegex = /\{\{\^(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;

  return template.replace(invertedRegex, (match, key, content) => {
    const value = data[key];

    // If falsy or empty array, render section
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return render(content, data);
    }

    // Otherwise, remove section
    return '';
  });
}

/**
 * Process {{variable}}
 */
function processVariables(template, data) {
  const variableRegex = /\{\{(\w+)\}\}/g;

  return template.replace(variableRegex, (match, key) => {
    const value = data[key];

    // Return value or empty string if undefined
    return value !== undefined && value !== null ? String(value) : '';
  });
}

/**
 * Render template from string (not file)
 */
export function renderTemplateString(templateString, data) {
  return render(templateString, data);
}
