import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AiAssistedDisclosure } from '@/components/AiAssistedDisclosure';

describe('AiAssistedDisclosure', () => {
  it('uses a native disclosure with a clear summary and ownership explanation', async () => {
    const user = userEvent.setup();
    const { container } = render(<AiAssistedDisclosure />);
    const details = container.querySelector('details');
    const summary = screen.getByText('How I use AI');

    expect(details).not.toBeNull();
    expect(details?.open).toBe(false);
    expect(summary.tagName).toBe('SUMMARY');
    expect(screen.getByText(/Coding agents help me implement faster/)).toBeInTheDocument();
    expect(screen.getByText(/I own the requirements and architecture/)).toBeInTheDocument();

    await user.click(summary);
    expect(details?.open).toBe(true);
  });

  it('explains that From Scratch does not exclude frameworks, libraries, or tools', () => {
    render(<AiAssistedDisclosure />);

    expect(screen.getByText(/“From Scratch” means I write the project code without AI assistance/)).toBeInTheDocument();
    expect(screen.getByText(/Frameworks, libraries, and developer tools can still be part of the work/)).toBeInTheDocument();
  });
});
