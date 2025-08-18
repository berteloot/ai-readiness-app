/**
 * Secure HTML sanitizer to prevent XSS attacks
 * This function removes all potentially dangerous HTML tags and attributes
 * while preserving safe formatting for markdown content.
 */

// Allowed HTML tags for markdown rendering
const ALLOWED_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', // Headers
  'p', 'br', 'div', 'span', // Basic structure
  'strong', 'b', 'em', 'i', 'u', // Text formatting
  'ul', 'ol', 'li', // Lists
  'blockquote', 'code', 'pre', // Code and quotes
  'hr', // Horizontal rule
  'table', 'thead', 'tbody', 'tr', 'th', 'td' // Tables
]);

// Allowed HTML attributes
const ALLOWED_ATTRIBUTES = new Set([
  'class', 'id', 'style', // Basic attributes
  'title', 'alt', // Accessibility
  'width', 'height', // Image dimensions (if we allow images)
  'colspan', 'rowspan' // Table attributes
]);

// Dangerous patterns that could lead to XSS
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
  /javascript:/gi, // JavaScript protocol
  /on\w+\s*=/gi, // Event handlers
  /vbscript:/gi, // VBScript protocol
  /data:/gi, // Data URLs
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, // Iframe tags
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, // Object tags
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, // Embed tags
  /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, // Form tags
  /<input\b[^<]*(?:(?!<\/input>)<[^<]*)*>/gi, // Input tags
  /<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi, // Textarea tags
  /<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi, // Select tags
  /<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi, // Button tags
  /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*>/gi, // Link tags
  /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*>/gi, // Meta tags
  /<base\b[^<]*(?:(?!<\/base>)<[^<]*)*>/gi, // Base tags
  /<bgsound\b[^<]*(?:(?!<\/bgsound>)<[^<]*)*>/gi, // BGSound tags
  /<xmp\b[^<]*(?:(?!<\/xmp>)<[^<]*)*<\/xmp>/gi, // XMP tags
  /<plaintext\b[^<]*(?:(?!<\/plaintext>)<[^<]*)*>/gi, // Plaintext tags
  /<listing\b[^<]*(?:(?!<\/listing>)<[^<]*)*<\/listing>/gi, // Listing tags
];

// CSS properties that could be dangerous
const DANGEROUS_CSS_PROPERTIES = [
  'expression', 'javascript', 'vbscript', 'url', 'behavior',
  'background-image', 'background', 'list-style-image'
];

/**
 * Sanitize HTML string to prevent XSS attacks
 */
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  let sanitized = html;

  // Remove dangerous patterns first
  DANGEROUS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Parse HTML and sanitize tags and attributes
  sanitized = sanitized.replace(/<[^>]*>/g, (match) => {
    return sanitizeHTMLTag(match);
  });

  // Additional safety: remove any remaining script-like content
  sanitized = sanitized.replace(/script/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');

  return sanitized;
}

/**
 * Sanitize individual HTML tag
 */
function sanitizeHTMLTag(tag: string): string {
  // Extract tag name
  const tagMatch = tag.match(/^<\/?(\w+)/);
  if (!tagMatch) return '';

  const tagName = tagMatch[1].toLowerCase();
  const isClosingTag = tag.startsWith('</');

  // If it's a closing tag, just return it if the tag is allowed
  if (isClosingTag) {
    return ALLOWED_TAGS.has(tagName) ? tag : '';
  }

  // If it's not an allowed tag, remove it
  if (!ALLOWED_TAGS.has(tagName)) {
    return '';
  }

  // Extract and sanitize attributes
  const attributeRegex = /(\w+)\s*=\s*["']([^"']*)["']/g;
  let sanitizedTag = `<${tagName}`;
  let match;

  while ((match = attributeRegex.exec(tag)) !== null) {
    const [fullMatch, attrName, attrValue] = match;
    const lowerAttrName = attrName.toLowerCase();

    // Skip dangerous attributes
    if (!ALLOWED_ATTRIBUTES.has(lowerAttrName)) {
      continue;
    }

    // Special handling for style attributes
    if (lowerAttrName === 'style') {
      const sanitizedStyle = sanitizeCSS(attrValue);
      if (sanitizedStyle) {
        sanitizedTag += ` ${attrName}="${sanitizedStyle}"`;
      }
      continue;
    }

    // For other attributes, just add them (they're already safe)
    sanitizedTag += ` ${attrName}="${attrValue}"`;
  }

  // Handle self-closing tags
  if (tag.endsWith('/>')) {
    sanitizedTag += ' />';
  } else {
    sanitizedTag += '>';
  }

  return sanitizedTag;
}

/**
 * Sanitize CSS to prevent CSS-based attacks
 */
function sanitizeCSS(css: string): string {
  if (!css || typeof css !== 'string') {
    return '';
  }

  let sanitized = css;

  // Remove dangerous CSS properties
  DANGEROUS_CSS_PROPERTIES.forEach(property => {
    const regex = new RegExp(`${property}\\s*:\\s*[^;]+;?`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  // Remove any remaining dangerous patterns
  sanitized = sanitized.replace(/expression\s*\(/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  sanitized = sanitized.replace(/url\s*\(\s*["']?javascript:/gi, 'url(');

  return sanitized.trim();
}

/**
 * Convert markdown to safe HTML with sanitization
 */
export function convertMarkdownToSafeHTML(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  // Convert markdown to HTML first
  const html = convertMarkdownToHTML(markdown);
  
  // Then sanitize the HTML to prevent XSS
  return sanitizeHTML(html);
}

/**
 * Basic markdown to HTML converter (kept for backward compatibility)
 * This function should only be used internally and always followed by sanitization
 */
function convertMarkdownToHTML(markdown: string): string {
  return markdown
    // Convert headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-text-primary mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-text-primary mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-text-primary mt-8 mb-4">$1</h1>')
    // Convert bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-text-primary">$1</strong>')
    // Convert italic text
    .replace(/\*(.*?)\*/g, '<em class="text-text-secondary">$1</em>')
    // Convert line breaks
    .replace(/\n\n/g, '</p><p class="mb-3">')
    // Convert single line breaks
    .replace(/\n/g, '<br>')
    // Clean up citations to only show organization names, not full URLs
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links but keep text
    .replace(/https?:\/\/[^\s]+/g, '') // Remove any remaining URLs
    // Wrap in paragraphs
    .replace(/^(.*)$/gm, '<p class="mb-3">$1</p>')
    // Clean up empty paragraphs
    .replace(/<p class="mb-3"><\/p>/g, '')
    // Remove extra paragraph wrappers
    .replace(/<p class="mb-3"><p class="mb-3">/g, '<p class="mb-3">')
    .replace(/<\/p><\/p>/g, '</p>');
}
