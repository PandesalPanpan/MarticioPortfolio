import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ChatWidget } from '@/components/ChatWidget/ChatWidget';

describe('ChatWidget availability', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('stays hidden when chat is not configured', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ available: false }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<ChatWidget />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/chat', expect.any(Object)));
    expect(screen.queryByRole('button', { name: 'Ask about Peter' })).not.toBeInTheDocument();
  });

  it('shows the launcher when chat is configured', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ available: true }),
      }),
    );

    render(<ChatWidget />);

    expect(await screen.findByRole('button', { name: 'Ask about Peter' })).toBeInTheDocument();
  });
});
