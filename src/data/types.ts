export type BuildStyle = 'ai-assisted' | 'from-scratch';

export type Project = {
  id: string;
  title: string;
  blurb: string;
  description?: string;
  tech: string[];
  buildStyle: BuildStyle;
  links: { live?: string; code?: string };
  featured: boolean;
  highlights?: string[];
  images?: string[];
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
};

export type Education = {
  id: string;
  institution: string;
  credential: string;
  start: string;
  end: string;
  link?: string;
  note?: string;
  /** Optional secondary call-to-action, e.g. open-source contributions. */
  contribution?: { label: string; url: string };
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  /** Imported full-resolution image shown in the lightbox. */
  image: string;
  /** Imported thumbnail image shown on the card. */
  thumb: string;
  /** Path to the original PDF in /public (download link). */
  pdf: string;
  /** Optional public verification URL. */
  verifyUrl?: string;
};
