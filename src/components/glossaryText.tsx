import type { ReactNode } from 'react';
import { glossary } from '@/data/glossary';
import { Term } from './Term';

/**
 * Splits a string and wraps any glossary terms found in it with <Term>, so
 * tooltips appear site-wide inside plain prose (hero, experience bullets, etc.).
 * Matches whole words only, longest terms first to avoid partial overlaps.
 */
export function renderWithGlossary(text: string): ReactNode[] {
  const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);
  if (terms.length === 0) return [text];
  const pattern = new RegExp(`\\b(${terms.map(escapeRegExp).join('|')})\\b`, 'g');

  const out: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    out.push(<Term key={key++} term={match[1]} />);
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
