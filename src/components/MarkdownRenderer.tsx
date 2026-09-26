'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Helper to parse inline Markdown formatting:
 * **bold**, *italic*, `code`, [link](url)
 */
function renderInline(text: string): React.ReactNode[] {
  // Regex to match **bold**, *italic*, `code`, [link](url)
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-zinc-950">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="italic text-zinc-800">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Inline Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-900 font-mono text-xs"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Link: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, linkText, linkUrl] = linkMatch;
      return (
        <a
          key={index}
          href={linkUrl}
          target={linkUrl.startsWith('http') ? '_blank' : undefined}
          rel={linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:text-blue-800 underline font-medium"
        >
          {linkText}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

/**
 * MarkdownRenderer component
 * Renders Markdown headings, lists (bullet & numbered), blockquotes, code and paragraphs cleanly.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split by double newlines or single newlines while grouping lists
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = (key: number) => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      blocks.push(
        <ul key={`ul-${key}`} className="my-4 space-y-2.5 pl-1">
          {currentList.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-zinc-700 leading-relaxed text-sm md:text-base">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2.5 flex-shrink-0" />
              <div className="flex-1">{renderInline(item)}</div>
            </li>
          ))}
        </ul>
      );
    } else {
      blocks.push(
        <ol key={`ol-${key}`} className="my-4 space-y-2.5 pl-1">
          {currentList.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-zinc-700 leading-relaxed text-sm md:text-base">
              <span className="flex items-center justify-center w-5 h-5 rounded-md bg-zinc-100 text-zinc-700 font-mono text-xs font-bold flex-shrink-0 mt-0.5 border border-zinc-200">
                {i + 1}
              </span>
              <div className="flex-1">{renderInline(item)}</div>
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(idx);
      return;
    }

    // Headings
    if (trimmed.startsWith('#### ')) {
      flushList(idx);
      blocks.push(
        <h4
          key={`h4-${idx}`}
          className="text-base font-bold text-zinc-900 mt-6 mb-2 tracking-tight"
        >
          {renderInline(trimmed.replace(/^####\s+/, ''))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('### ')) {
      flushList(idx);
      blocks.push(
        <h3
          key={`h3-${idx}`}
          className="text-lg md:text-xl font-bold text-zinc-950 mt-8 mb-3 tracking-tight flex items-center gap-2"
        >
          {renderInline(trimmed.replace(/^###\s+/, ''))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList(idx);
      blocks.push(
        <h2
          key={`h2-${idx}`}
          className="text-xl md:text-2xl font-extrabold text-zinc-950 mt-10 mb-4 pb-2 border-b border-zinc-100 tracking-tight"
        >
          {renderInline(trimmed.replace(/^##\s+/, ''))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushList(idx);
      blocks.push(
        <h1
          key={`h1-${idx}`}
          className="text-2xl md:text-3xl font-black text-zinc-950 mt-10 mb-4 tracking-tight"
        >
          {renderInline(trimmed.replace(/^#\s+/, ''))}
        </h1>
      );
      return;
    }

    // Bullet lists: • , - , *
    const bulletMatch = trimmed.match(/^([•\-\*])\s+(.+)$/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList(idx);
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(bulletMatch[2]);
      return;
    }

    // Numbered lists: 1. , 2. etc.
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList(idx);
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(numMatch[2]);
      return;
    }

    // Blockquote: > quote
    if (trimmed.startsWith('>')) {
      flushList(idx);
      blocks.push(
        <blockquote
          key={`quote-${idx}`}
          className="border-l-4 border-blue-600 bg-blue-50/40 rounded-r-xl px-4 py-3 my-4 text-zinc-700 italic text-sm md:text-base leading-relaxed"
        >
          {renderInline(trimmed.replace(/^>\s*/, ''))}
        </blockquote>
      );
      return;
    }

    // Normal paragraph
    flushList(idx);
    blocks.push(
      <p
        key={`p-${idx}`}
        className="text-zinc-700 leading-relaxed text-sm md:text-base mb-4 font-normal"
      >
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList(lines.length);

  return <div className={`blog-content ${className}`}>{blocks}</div>;
};

export default MarkdownRenderer;
