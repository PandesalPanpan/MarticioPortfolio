import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Projects } from '@/sections/Projects';
import { projects } from '@/data/projects';

describe('Projects', () => {
  it('renders a card for every featured project', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );
    const featured = projects.filter((p) => p.featured);
    for (const p of featured) {
      expect(screen.getByRole('heading', { name: p.title, level: 3 })).toBeInTheDocument();
    }
  });

  it('shows the build-style badges with correct labels', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );
    expect(screen.getAllByText('AI-Assisted').length).toBeGreaterThan(0);
    expect(screen.getAllByText('From Scratch').length).toBeGreaterThan(0);
  });
});
