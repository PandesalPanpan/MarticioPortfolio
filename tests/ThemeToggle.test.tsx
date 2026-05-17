import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '@/components/ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('toggles theme and persists preference', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const btn = screen.getByRole('button');

    await user.click(btn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('mp-theme')).toBe('dark');

    await user.click(btn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('mp-theme')).toBe('light');
  });
});
