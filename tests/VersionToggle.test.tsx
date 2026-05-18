import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { VersionToggle } from '@/components/VersionToggle';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <VersionToggle />
    </MemoryRouter>,
  );
}

describe('VersionToggle', () => {
  it('marks Agentic active on /', () => {
    renderAt('/');
    expect(screen.getByRole('link', { name: 'Agentic' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Handmade' })).not.toHaveAttribute('aria-current');
  });

  it('marks Handmade active on /handmade', () => {
    renderAt('/handmade');
    expect(screen.getByRole('link', { name: 'Handmade' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Agentic' })).not.toHaveAttribute('aria-current');
  });
});
