import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_ORIGIN = 'https://marticio.com';
const OG_IMAGE = `${SITE_ORIGIN}/og.png`;
const HOME_DESCRIPTION =
  'Full-stack developer and Computer Engineering student at PUP building production web apps, offline-ready software, inventory systems, and real-time applications.';

type RouteMetadataEntry = {
  title: string;
  description: string;
  canonical: string;
};

const ROUTE_METADATA: Record<string, RouteMetadataEntry> = {
  '/': {
    title: 'Peter Elijah Marticio | Full-Stack Developer',
    description: HOME_DESCRIPTION,
    canonical: `${SITE_ORIGIN}/`,
  },
  '/handmade': {
    title: 'Handmade Portfolio Version | Peter Elijah Marticio',
    description:
      'Follow the in-progress, from-scratch version of Peter Elijah Marticio’s developer portfolio, built by hand without AI tools.',
    canonical: `${SITE_ORIGIN}/handmade`,
  },
  '/colophon': {
    title: 'How This Portfolio Was Built | Peter Elijah Marticio',
    description:
      'Learn how Peter Elijah Marticio built this portfolio with AI-assisted pair programming and is creating a second version from scratch.',
    canonical: `${SITE_ORIGIN}/colophon`,
  },
};

const NOT_FOUND_METADATA = {
  title: 'Page Not Found | Peter Elijah Marticio',
  description: 'The requested page could not be found on Peter Elijah Marticio’s portfolio.',
};

function setMeta(attribute: 'name' | 'property', key: string, content: string | null) {
  const matches = Array.from(
    document.head.querySelectorAll<HTMLMetaElement>(`meta[${attribute}="${key}"]`),
  );
  const [meta, ...duplicates] = matches;
  duplicates.forEach((duplicate) => duplicate.remove());

  if (content === null) {
    meta?.remove();
    return;
  }

  const target = meta ?? document.createElement('meta');
  target.setAttribute(attribute, key);
  target.content = content;
  if (!meta) document.head.append(target);
}

function setCanonical(url: string | null) {
  const matches = Array.from(
    document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]'),
  );
  const [canonical, ...duplicates] = matches;
  duplicates.forEach((duplicate) => duplicate.remove());

  if (url === null) {
    canonical?.remove();
    return;
  }

  if (canonical) {
    canonical.href = url;
    return;
  }

  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = url;
  document.head.append(link);
}

export function RouteMetadata() {
  const { pathname } = useLocation();
  const routePath = pathname.replace(/\/+$/, '') || '/';
  const metadata = ROUTE_METADATA[routePath];

  useEffect(() => {
    const title = metadata?.title ?? NOT_FOUND_METADATA.title;
    const description = metadata?.description ?? NOT_FOUND_METADATA.description;
    const canonical = metadata?.canonical ?? null;

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', OG_IMAGE);
    setMeta('property', 'og:image:alt', 'Peter Elijah Marticio, Full-Stack Developer');
    setMeta('property', 'og:site_name', 'Peter Elijah Marticio');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', OG_IMAGE);
    setMeta('name', 'robots', metadata ? null : 'noindex,follow');
    setCanonical(canonical);
  }, [metadata]);

  return null;
}
