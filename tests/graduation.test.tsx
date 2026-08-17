import { describe, it, expect, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { render, screen } from '@testing-library/react';
import { GRADUATION_ISO, GRADUATION_YEAR, hasGraduated } from '@/data/graduation';
import { Hero } from '@/sections/Hero';
import { Now } from '@/sections/Now';

/** A moment safely inside each side of the cutoff. */
const BEFORE = new Date('2026-06-01T12:00:00');
const AFTER = new Date('2027-06-01T12:00:00');

afterEach(() => {
  vi.useRealTimers();
});

/** Freeze the clock so the components read a deterministic "today". */
function at(when: Date) {
  vi.useFakeTimers();
  vi.setSystemTime(when);
}

describe('graduation cutoff', () => {
  it('flips exactly at the start of the graduation day, in local time', () => {
    const midnight = new Date(`${GRADUATION_ISO}T00:00:00`);
    const justBefore = new Date(midnight.getTime() - 1);
    expect(hasGraduated(justBefore)).toBe(false);
    expect(hasGraduated(midnight)).toBe(true);
  });

  it('treats the surrounding years correctly', () => {
    expect(hasGraduated(BEFORE)).toBe(false);
    expect(hasGraduated(AFTER)).toBe(true);
  });

  // The server runs as plain .mjs with no build step, so it cannot import the
  // TypeScript module. This catches the copies drifting apart.
  it('keeps server/graduation.mjs in sync with the site constant', () => {
    const src = readFileSync('server/graduation.mjs', 'utf8');
    expect(src).toContain(`GRADUATION_ISO = '${GRADUATION_ISO}'`);
    expect(src).toContain(`GRADUATION_YEAR = '${GRADUATION_YEAR}'`);
  });
});

describe('copy follows the cutoff', () => {
  it('calls Peter a student before, and a graduate after', () => {
    at(BEFORE);
    const { unmount } = render(<Hero />);
    expect(screen.getByText(/Computer Engineering student/i)).toBeInTheDocument();
    unmount();

    at(AFTER);
    render(<Hero />);
    expect(screen.getByText(/Computer Engineering graduate/i)).toBeInTheDocument();
  });

  it('swaps the Now strip from finishing the degree to having finished it', () => {
    at(BEFORE);
    const { unmount } = render(<Now />);
    expect(screen.getByText(/finishing Computer Engineering at PUP/i)).toBeInTheDocument();
    unmount();

    at(AFTER);
    render(<Now />);
    expect(screen.getByText(/newly graduated in Computer Engineering/i)).toBeInTheDocument();
  });
});
