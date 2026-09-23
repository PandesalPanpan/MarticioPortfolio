import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RouteMetadata } from '@/seo/RouteMetadata';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <RouteMetadata />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  document.head.innerHTML = `
    <title>Initial title</title>
    <meta name="description" content="Initial description" />
    <meta property="og:title" content="Initial title" />
    <meta property="og:description" content="Initial description" />
    <meta property="og:url" content="https://marticio.com/" />
    <meta property="og:image" content="https://marticio.com/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href="https://marticio.com/" />
    <link rel="canonical" href="https://example.invalid/" />
  `;
});

it('keeps the homepage metadata and a single canonical URL', async () => {
  renderAt('/');

  await waitFor(() => {
    expect(document.title).toBe('Peter Elijah Marticio | Full-Stack Developer');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain(
      'production web apps',
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://marticio.com/',
    );
  });

  expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://marticio.com/',
  );
  expect(document.querySelector('meta[name="robots"]')).not.toBeInTheDocument();
});

it('sets route-specific metadata for the handmade page', async () => {
  renderAt('/handmade');

  await waitFor(() => {
    expect(document.title).toBe('Handmade Portfolio Version | Peter Elijah Marticio');
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://marticio.com/handmade',
    );
  });

  expect(
    document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
  ).toContain('in-progress, from-scratch version');
});

it('sets route-specific metadata for the colophon page', async () => {
  renderAt('/colophon');

  await waitFor(() => {
    expect(document.title).toBe('How This Portfolio Was Built | Peter Elijah Marticio');
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://marticio.com/colophon',
    );
  });

  expect(
    document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
  ).toContain('AI-assisted pair programming');
});

it('marks unknown routes noindex and removes the root canonical', async () => {
  renderAt('/missing-page');

  await waitFor(() => {
    expect(document.title).toBe('Page Not Found | Peter Elijah Marticio');
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex,follow',
    );
  });

  expect(document.querySelector('link[rel="canonical"]')).not.toBeInTheDocument();
  expect(document.querySelector('meta[property="og:url"]')).not.toBeInTheDocument();
});
