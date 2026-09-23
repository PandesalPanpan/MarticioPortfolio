import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectCard } from '@/components/ProjectCard';
import { Projects } from '@/sections/Projects';
import { projects } from '@/data/projects';
import type { Project } from '@/data/types';

const projectWithoutOptionalFields: Project = {
  id: 'plain-project',
  title: 'Plain Project',
  blurb: 'A project without expanded proof or media.',
  role: 'Sole developer',
  status: 'Complete',
  tech: ['TypeScript'],
  buildStyle: 'from-scratch',
  links: {},
  featured: true,
};

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

describe('ProjectCard engineering evidence', () => {
  it('renders an engineering decision when the project defines one', () => {
    const project = projects.find((item) => item.id === 'memorizemate')!;
    render(<ProjectCard project={project} />);

    expect(screen.getByText('Engineering decision')).toBeInTheDocument();
    expect(screen.getByText(project.engineeringDecision!)).toBeInTheDocument();
  });

  it('renders evidence badges only when evidence is defined', () => {
    const evidencedProject = projects.find((item) => item.id === 'classhub')!;
    const plainProject = projects.find((item) => item.id === 'binary-speed')!;

    const { unmount } = render(<ProjectCard project={evidencedProject} />);
    expect(screen.getByText('Evidence')).toBeInTheDocument();
    expect(screen.getByText('Used by PUP CompE Dept.')).toBeInTheDocument();

    unmount();
    render(<ProjectCard project={plainProject} />);
    expect(screen.queryByText('Evidence')).not.toBeInTheDocument();
  });

  it('keeps rendering projects without optional fields', () => {
    render(<ProjectCard project={projectWithoutOptionalFields} />);

    expect(screen.getByRole('heading', { name: 'Plain Project', level: 3 })).toBeInTheDocument();
    expect(screen.getByText(projectWithoutOptionalFields.blurb)).toBeInTheDocument();
    expect(screen.getByText('Sole developer')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.queryByText('Engineering decision')).not.toBeInTheDocument();
    expect(screen.queryByText('Evidence')).not.toBeInTheDocument();
  });
});
